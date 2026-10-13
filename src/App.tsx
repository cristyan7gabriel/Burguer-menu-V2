import { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Utensils, CheckCircle } from 'lucide-react';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { ConfigModal } from './components/ConfigModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { PRODUCTS, STORE_CONFIG_DEFAULT } from './data/products';
import { Product, CategoryType, CartItem, SelectedExtra, CustomerData, StoreConfig } from './types';
import { formatCurrency } from './utils/formatters';

export default function App() {
  // Store Config
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('burger_house_config');
      return saved ? JSON.parse(saved) : STORE_CONFIG_DEFAULT;
    } catch {
      return STORE_CONFIG_DEFAULT;
    }
  });

  // Save config changes to localStorage
  const handleSaveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('burger_house_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
  };

  // Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('burger_house_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('burger_house_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Customer Data for checkout
  const [customerData, setCustomerData] = useState<CustomerData>({
    nome: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    tipoEntrega: 'delivery',
    formaPagamento: 'pix',
    trocoPara: '',
  });

  const handleUpdateCustomerData = (data: Partial<CustomerData>) => {
    setCustomerData((prev) => ({ ...prev, ...data }));
  };

  // Category and Search Filtering
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Calculate items count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: PRODUCTS.length,
    };
    PRODUCTS.forEach((prod) => {
      counts[prod.categoria] = (counts[prod.categoria] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.categoria === selectedCategory;

      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        product.nome.toLowerCase().includes(normalizedSearch) ||
        product.descricao.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Cart summary calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cart]);

  // Handlers for cart operations
  const handleAddToCart = (
    product: Product,
    quantidade: number,
    adicionais: SelectedExtra[],
    pontoCarne: string | undefined,
    observacoes: string,
    totalItem: number
  ) => {
    const unitPrice = totalItem / quantidade;
    const newItem: CartItem = {
      cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      product,
      quantidade,
      adicionais,
      pontoCarne,
      observacoes,
      precoUnitarioCalculado: unitPrice,
      subtotal: totalItem,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`${quantidade}x ${product.nome} adicionado à sacola!`);
  };

  const handleQuickAdd = (product: Product) => {
    if (product.permite_adicionais || product.pontos_carne) {
      setCustomizingProduct(product);
      return;
    }

    const newItem: CartItem = {
      cartItemId: `${product.id}-${Date.now()}`,
      product,
      quantidade: 1,
      adicionais: [],
      observacoes: '',
      precoUnitarioCalculado: product.preco,
      subtotal: product.preco,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`1x ${product.nome} adicionado à sacola!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantidade: newQty,
            subtotal: item.precoUnitarioCalculado * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 flex flex-col antialiased selection:bg-amber-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 pointer-events-none">
          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with store brand and info */}
      <Header
        config={config}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Sticky Categories Chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultCount={filteredProducts.length}
      />

      {/* Main Catalog Vitrine */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        {filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center text-zinc-500 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-300">Nenhum produto encontrado</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              Tente buscar por outro termo ou selecione uma categoria diferente no topo.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs font-bold text-amber-400 hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setCustomizingProduct(p)}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Floating Cart Button (capped to < 15% viewport height) */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-extrabold py-3.5 px-5 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-between transition-all cursor-pointer border border-amber-400/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-black" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-sm">Ver Sacola ({cartCount})</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-base font-black">
              <span>{formatCurrency(cartTotal)}</span>
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 text-xs text-zinc-500 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="font-heading font-bold text-sm text-zinc-300 block">
              {config.nome}
            </span>
            <span className="text-[11px] text-zinc-500">
              {config.endereco} • Pedidos diretos via WhatsApp
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Configurar Loja
            </button>
            <span>•</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Download index.html Standalone
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CustomizationModal
        product={customizingProduct}
        isOpen={Boolean(customizingProduct)}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        config={config}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        customerData={customerData}
        onUpdateCustomerData={handleUpdateCustomerData}
      />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      <StandaloneExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
