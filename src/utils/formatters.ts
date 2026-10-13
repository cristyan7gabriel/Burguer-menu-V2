import { CartItem, CustomerData, StoreConfig } from '../types';

export function formatCurrency(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPhone(value: string): string {
  // Remove non-digits
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function cleanPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function buildWhatsAppOrderMessage(
  cart: CartItem[],
  customer: CustomerData,
  config: StoreConfig,
  subtotal: number,
  taxaEntregaEfetiva: number,
  total: number
): string {
  const isDelivery = customer.tipoEntrega === 'delivery';

  // Format payment display
  let paymentText = '';
  if (customer.formaPagamento === 'pix') {
    paymentText = 'Pix (Chave enviada no WhatsApp)';
  } else if (customer.formaPagamento === 'cartao') {
    paymentText = 'Cartão (Entregador leva a maquininha)';
  } else if (customer.formaPagamento === 'dinheiro') {
    if (customer.trocoPara && customer.trocoPara.trim()) {
      paymentText = `Dinheiro (Troco para ${customer.trocoPara.trim()})`;
    } else {
      paymentText = 'Dinheiro (Sem troco / Valor exato)';
    }
  }

  // Format delivery address or pickup
  let addressText = '';
  if (isDelivery) {
    const complementPart = customer.complemento ? ` (${customer.complemento.trim()})` : '';
    addressText = `${customer.rua.trim()}, Nº ${customer.numero.trim()} - ${customer.bairro.trim()}${complementPart}`;
  } else {
    addressText = `Retirada no balcão da loja (${config.endereco})`;
  }

  // Format items list
  const itemsText = cart
    .map((item) => {
      let lines = `• ${item.quantidade}x ${item.product.nome} (${formatCurrency(item.subtotal)})`;
      
      if (item.pontoCarne) {
        lines += `\n  └ Ponto da carne: ${item.pontoCarne}`;
      }

      if (item.adicionais && item.adicionais.length > 0) {
        const adds = item.adicionais.map((a) => `+ ${a.nome} (${formatCurrency(a.preco)})`).join(', ');
        lines += `\n  └ Adicionais: ${adds}`;
      }

      if (item.observacoes && item.observacoes.trim()) {
        lines += `\n  └ Obs: ${item.observacoes.trim()}`;
      }

      return lines;
    })
    .join('\n');

  // Build the message strictly following user specifications
  const message = [
    `🍔 *NOVO PEDIDO - ${config.nome.toUpperCase()}*`,
    `----------------------------------`,
    `👤 *Cliente:* ${customer.nome.trim()}`,
    `📱 *Contato:* ${customer.telefone.trim()}`,
    `🛵 *Opção:* ${isDelivery ? 'Delivery (Entrega)' : 'Retirada no Balcão'}`,
    `📍 *Endereço:* ${addressText}`,
    ``,
    `🧾 *ITENS DO PEDIDO:*`,
    itemsText,
    ``,
    `----------------------------------`,
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Taxa de Entrega: ${isDelivery ? formatCurrency(taxaEntregaEfetiva) : 'Grátis (Retirada)'}`,
    `💰 *TOTAL A PAGAR: ${formatCurrency(total)}*`,
    `💳 *Forma de Pagamento:* ${paymentText}`,
  ].join('\n');

  return message;
}
