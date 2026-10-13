import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Bike,
  Store,
  CreditCard,
  QrCode,
  Banknote,
  Send,
  AlertCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { CartItem, CustomerData, StoreConfig, DeliveryType, PaymentMethod } from '../types';
import { formatCurrency, formatPhone, cleanPhone, buildWhatsAppOrderMessage } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  config: StoreConfig;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  customerData: CustomerData;
  onUpdateCustomerData: (data: Partial<CustomerData>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  config,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customerData,
  onUpdateCustomerData,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const taxaEntrega = customerData.tipoEntrega === 'delivery' ? config.taxaEntrega : 0;
  const total = subtotal + taxaEntrega;

  // Validate form and send order via WhatsApp
  const handleFinalizeOrder = () => {
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Sua sacola está vazia. Adicione algum item para pedir!');
      return;
    }

    if (!customerData.nome.trim()) {
      setErrorMessage('Por favor, informe o seu Nome completo para o pedido.');
      return;
    }

    const cleanedPhone = cleanPhone(customerData.telefone);
    if (!cleanedPhone || cleanedPhone.length < 10) {
      setErrorMessage('Por favor, digite um Telefone/WhatsApp válido com DDD.');
      return;
    }

    if (customerData.tipoEntrega === 'delivery') {
      if (!customerData.rua.trim() || !customerData.numero.trim() || !customerData.bairro.trim()) {
        setErrorMessage('Para entrega, preencha Rua, Número e Bairro obrigatoriamente.');
        return;
      }
    }

    if (customerData.formaPagamento === 'dinheiro' && !customerData.trocoPara.trim()) {
      // Optional check, but let's allow "Sem troco" if left blank
    }

    // Build the WhatsApp message text
    const message = buildWhatsAppOrderMessage(
      cart,
      customerData,
      config,
      subtotal,
      taxaEntrega,
      total
    );

    // Build WhatsApp URL with the store's configured phone number
    const storePhoneClean = cleanPhone(config.whatsapp) || '5511999998888';
    const whatsappUrl = `https://wa.me/${storePhoneClean}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:max-w-lg">
        <div className="w-full bg-[#141416] border-l border-zinc-800 flex flex-col shadow-2xl relative">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  Sua Sacola
                </h2>
                <span className="text-xs text-zinc-400">
                  {cart.length} {cart.length === 1 ? 'item adicionado' : 'itens adicionados'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 rounded transition-colors"
                  title="Esvaziar sacola"
                >
                  Limpar
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Empty State */}
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-300">Sua sacola está vazia</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore nosso cardápio de hambúrgueres artesanais e monte seu lanche dos sonhos!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Explorar Cardápio
                </button>
              </div>
            ) : (
              <>
                {/* 1. Itemized Cart Items */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Itens Selecionados
                  </span>

                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3 flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <img
                              src={item.product.url_imagem}
                              alt={item.product.nome}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-800"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white font-heading truncate">
                                {item.product.nome}
                              </h4>
                              <div className="text-xs font-mono font-semibold text-amber-400">
                                {formatCurrency(item.precoUnitarioCalculado)} un.
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black font-mono text-zinc-100">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        </div>

                        {/* Extras & Customizations */}
                        {(item.adicionais.length > 0 || item.pontoCarne || item.observacoes) && (
                          <div className="bg-zinc-950/70 rounded-xl p-2.5 text-[11px] text-zinc-400 space-y-1 border border-zinc-800/50">
                            {item.pontoCarne && (
                              <div className="text-zinc-300">
                                <span className="text-amber-400/80 font-medium">Ponto:</span>{' '}
                                {item.pontoCarne}
                              </div>
                            )}

                            {item.adicionais.length > 0 && (
                              <div>
                                <span className="text-amber-400/80 font-medium">Adicionais:</span>{' '}
                                {item.adicionais.map((a) => a.nome).join(', ')}
                              </div>
                            )}

                            {item.observacoes && (
                              <div className="italic text-zinc-300">
                                <span className="text-amber-400/80 font-medium not-italic">Obs:</span>{' '}
                                "{item.observacoes}"
                              </div>
                            )}
                          </div>
                        )}

                        {/* Quantity Controls & Delete */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remover</span>
                          </button>

                          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantidade - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-white font-mono">
                              {item.quantidade}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantidade + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Delivery vs Retirada Selector */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Tipo de Atendimento
                  </span>

                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => onUpdateCustomerData({ tipoEntrega: 'delivery' })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        customerData.tipoEntrega === 'delivery'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Delivery ({formatCurrency(config.taxaEntrega)})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateCustomerData({ tipoEntrega: 'retirada' })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        customerData.tipoEntrega === 'retirada'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Retirada (Grátis)</span>
                    </button>
                  </div>
                </div>

                {/* 3. Delivery Address Fields (Conditional) */}
                {customerData.tipoEntrega === 'delivery' ? (
                  <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      Endereço de Entrega
                    </span>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="text-zinc-400 block mb-1">Rua / Avenida *</label>
                        <input
                          type="text"
                          value={customerData.rua}
                          onChange={(e) => onUpdateCustomerData({ rua: e.target.value })}
                          placeholder="Ex: Av. Paulista ou Rua das Flores"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="text-zinc-400 block mb-1">Número *</label>
                          <input
                            type="text"
                            value={customerData.numero}
                            onChange={(e) => onUpdateCustomerData({ numero: e.target.value })}
                            placeholder="120"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-zinc-400 block mb-1">Bairro *</label>
                          <input
                            type="text"
                            value={customerData.bairro}
                            onChange={(e) => onUpdateCustomerData({ bairro: e.target.value })}
                            placeholder="Ex: Centro"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-400 block mb-1">Complemento / Referência</label>
                        <input
                          type="text"
                          value={customerData.complemento}
                          onChange={(e) => onUpdateCustomerData({ complemento: e.target.value })}
                          placeholder="Ex: Apto 42, Bloco B ou Próximo à padaria"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-xs text-amber-300">
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-amber-400" />
                      Retirada no Balcão:
                    </div>
                    <div className="text-zinc-300">
                      Você pode retirar no endereço: <strong>{config.endereco}</strong>.
                      Tempo estimado: 25 a 35 minutos após o envio do pedido.
                    </div>
                  </div>
                )}

                {/* 4. Customer Contact Details */}
                <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Seus Dados para o Pedido
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-zinc-400 block mb-1">Seu Nome *</label>
                      <input
                        type="text"
                        value={customerData.nome}
                        onChange={(e) => onUpdateCustomerData({ nome: e.target.value })}
                        placeholder="Ex: Carlos Oliveira"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">WhatsApp de Contato *</label>
                      <input
                        type="tel"
                        value={customerData.telefone}
                        onChange={(e) => onUpdateCustomerData({ telefone: formatPhone(e.target.value) })}
                        placeholder="(11) 99999-8888"
                        maxLength={15}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Payment Options */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Forma de Pagamento
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateCustomerData({ formaPagamento: 'pix' })}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                        customerData.formaPagamento === 'pix'
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      <span>Pix</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateCustomerData({ formaPagamento: 'cartao' })}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                        customerData.formaPagamento === 'cartao'
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      <span>Cartão</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateCustomerData({ formaPagamento: 'dinheiro' })}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                        customerData.formaPagamento === 'dinheiro'
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-amber-400" />
                      <span>Dinheiro</span>
                    </button>
                  </div>

                  {/* Payment sub-notes */}
                  {customerData.formaPagamento === 'pix' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2.5 rounded-xl text-xs">
                      ⚡ <strong>Chave Pix enviada no WhatsApp:</strong> O atendente enviará a chave Copia e Cola assim que você enviar o pedido.
                    </div>
                  )}

                  {customerData.formaPagamento === 'cartao' && (
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-2.5 rounded-xl text-xs">
                      💳 <strong>Maquininha na entrega:</strong> Aceitamos Débito, Crédito e Vale-Refeição (Alelo/VR/Sodexo).
                    </div>
                  )}

                  {customerData.formaPagamento === 'dinheiro' && (
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs space-y-1.5">
                      <label className="text-zinc-300 block font-medium">
                        Precisa de troco para quanto?
                      </label>
                      <input
                        type="text"
                        value={customerData.trocoPara}
                        onChange={(e) => onUpdateCustomerData({ trocoPara: e.target.value })}
                        placeholder="Ex: R$ 50,00 ou Não preciso"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Financial Summary & WhatsApp Button */}
          {cart.length > 0 && (
            <div className="p-5 bg-zinc-950 border-t border-zinc-800 space-y-3 shrink-0">
              {/* Error feedback alert */}
              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal dos itens</span>
                  <span className="text-zinc-200 font-mono">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Taxa de Entrega</span>
                  <span className="font-mono text-zinc-200">
                    {customerData.tipoEntrega === 'delivery'
                      ? formatCurrency(taxaEntrega)
                      : 'Grátis (Retirada)'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-sm font-bold text-white">
                  <span>TOTAL A PAGAR</span>
                  <span className="text-lg font-black font-mono text-amber-400">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Big WhatsApp CTA Button */}
              <button
                type="button"
                onClick={handleFinalizeOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Finalizar Pedido pelo WhatsApp</span>
              </button>

              <p className="text-[11px] text-zinc-500 text-center">
                Seu pedido será formatado e enviado diretamente para nosso WhatsApp oficial.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
