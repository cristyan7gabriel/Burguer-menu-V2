export type CategoryType =
  | 'Todos'
  | 'Burgers Artesanais'
  | 'Combos'
  | 'Porções & Fritas'
  | 'Bebidas'
  | 'Sobremesas';

export interface ExtraOption {
  id: string;
  nome: string;
  preco: number;
}

export interface Product {
  id: string;
  nome: string;
  categoria: CategoryType;
  preco: number;
  descricao: string;
  url_imagem: string;
  permite_adicionais: boolean;
  tag?: string;
  pontos_carne?: boolean;
}

export interface SelectedExtra {
  id: string;
  nome: string;
  preco: number;
}

export interface CartItem {
  cartItemId: string; // unique instance in cart
  product: Product;
  quantidade: number;
  adicionais: SelectedExtra[];
  pontoCarne?: string;
  observacoes: string;
  precoUnitarioCalculado: number;
  subtotal: number;
}

export type DeliveryType = 'delivery' | 'retirada';

export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro';

export interface CustomerData {
  nome: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  tipoEntrega: DeliveryType;
  formaPagamento: PaymentMethod;
  trocoPara: string;
}

export interface StoreConfig {
  nome: string;
  whatsapp: string; // e.g. 5511999998888
  taxaEntrega: number;
  horarioFuncionamento: string;
  tempoEstimado: string;
  aberto: boolean;
  endereco: string;
}
