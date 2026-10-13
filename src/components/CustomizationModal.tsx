import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { Product, SelectedExtra } from '../types';
import { EXTRAS_DISPONIVEIS, PONTOS_CARNE } from '../data/products';
import { formatCurrency } from '../utils/formatters';

interface CustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantidade: number,
    adicionais: SelectedExtra[],
    pontoCarne: string | undefined,
    observacoes: string,
    totalItem: number
  ) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantidade, setQuantidade] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [pontoCarne, setPontoCarne] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  // Reset internal states when opened with a product
  useEffect(() => {
    if (product) {
      setQuantidade(1);
      setSelectedExtras([]);
      setObservacoes('');
      if (product.pontos_carne) {
        setPontoCarne(PONTOS_CARNE[0]);
      } else {
        setPontoCarne('');
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Toggle extra checkbox
  const handleToggleExtra = (extra: { id: string; nome: string; preco: number }) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      } else {
        return [...prev, { id: extra.id, nome: extra.nome, preco: extra.preco }];
      }
    });
  };

  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.preco, 0);
  const unitPrice = product.preco + extrasTotal;
  const totalPrice = unitPrice * quantidade;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(
      product,
      quantidade,
      selectedExtras,
      product.pontos_carne ? pontoCarne : undefined,
      observacoes,
      totalPrice
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-[#161619] border border-zinc-800 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-black relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative h-44 sm:h-52 w-full bg-zinc-900 shrink-0">
          <img
            src={product.url_imagem}
            alt={product.nome}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161619] via-[#161619]/40 to-black/40"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-black inline-block mb-1">
              {product.categoria}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-wide">
              {product.nome}
            </h2>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Description */}
          <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
            {product.descricao}
          </div>

          {/* Doneness Selector (if applicable) */}
          {product.pontos_carne && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ponto da Carne (Escolha 1)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PONTOS_CARNE.map((ponto) => (
                  <label
                    key={ponto}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      pontoCarne === ponto
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="pontoCarne"
                        value={ponto}
                        checked={pontoCarne === ponto}
                        onChange={() => setPontoCarne(ponto)}
                        className="text-amber-500 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>{ponto}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Paid Additions (Extras) */}
          {product.permite_adicionais && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Turbine seu Lanche (Opcional)
                </label>
                <span className="text-[11px] text-zinc-500">Escolha até 7 adicionais</span>
              </div>

              <div className="space-y-2">
                {EXTRAS_DISPONIVEIS.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => handleToggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-500/80 text-white shadow-sm'
                          : 'bg-zinc-900/70 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'border-zinc-700 bg-zinc-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="font-medium">{extra.nome}</span>
                      </div>

                      <span className="text-amber-400 font-bold font-mono text-xs">
                        + {formatCurrency(extra.preco)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observations Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>Observações para a Cozinha</span>
              <span className="text-[10px] text-zinc-500 font-normal">Opcional</span>
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Tirar cebola, maionese à parte, lanche bem prensado..."
              rows={2}
              maxLength={200}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              disabled={quantidade <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-white font-mono">
              {quantidade}
            </span>
            <button
              type="button"
              onClick={() => setQuantidade((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button with Live Price */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Adicionar à Sacola</span>
            <span className="font-mono text-sm tracking-tight">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
