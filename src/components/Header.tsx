import React from 'react';
import { ShoppingBag, Clock, MapPin, Settings, Code, Sparkles } from 'lucide-react';
import { StoreConfig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  config: StoreConfig;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenConfig: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenConfig,
  onOpenExport,
}) => {
  return (
    <header className="relative w-full bg-[#121214] border-b border-zinc-800/80">
      {/* Top Bar for Demonstration & Store Status */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {config.aberto ? 'Aberto agora' : 'Fechado no momento'} • {config.horarioFuncionamento}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onOpenConfig}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors cursor-pointer"
              title="Personalizar WhatsApp e dados para demonstração"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Configurar WhatsApp da Loja</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-md transition-colors cursor-pointer"
              title="Ver e baixar o arquivo index.html único e independente"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Código index.html Único</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Food Ambience */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80"
          alt="Burger House Gastronomia"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 filter blur-[0.5px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>

        {/* Floating Quick Action in Hero for Desktop */}
        <div className="absolute top-4 right-4 sm:right-6 hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-bold">Minha Sacola</div>
              <div className="text-[11px] font-black">{formatCurrency(cartTotal)}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Restaurant Profile Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4">
          {/* Logo & Brand Details */}
          <div className="flex items-start sm:items-end gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-900 p-1 shadow-2xl border-2 border-amber-500/40 shrink-0 overflow-hidden group">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 flex flex-col items-center justify-center text-center p-2 text-white shadow-inner">
                <span className="text-2xl sm:text-3xl">🍔</span>
                <span className="font-heading font-black tracking-wider text-xs sm:text-sm text-amber-200 mt-0.5 uppercase leading-none">
                  BURGER
                </span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-300 font-semibold">
                  HOUSE
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                Artesanal
              </div>
            </div>

            <div className="pt-2 sm:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
                  {config.nome}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30">
                  <Sparkles className="w-3 h-3" />
                  Gourmet & Smash
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Hambúrgueres preparados na brasa e na chapa, pães brioche artesanais e molhos de receita exclusiva.
              </p>

              {/* Informative Badges */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-400 mt-2.5">
                <div className="flex items-center gap-1 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Entrega: <strong className="text-white">{config.tempoEstimado}</strong></span>
                </div>

                <span className="text-zinc-600 hidden sm:inline">•</span>

                <div className="flex items-center gap-1 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Taxa: <strong className="text-amber-400">{formatCurrency(config.taxaEntrega)}</strong> (ou Retirada Grátis)</span>
                </div>

                <span className="text-zinc-600 hidden sm:inline">•</span>

                <div className="text-emerald-400 font-medium">
                  ★ 4.9 <span className="text-zinc-500">(380+ avaliações)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mobile Cart Header Button */}
          <div className="sm:hidden flex items-center justify-between pt-1 border-t border-zinc-800/60 mt-1">
            <span className="text-xs text-zinc-400">
              Mínimo R$ 20,00 • Pagamento via Pix/Cartão/Dinheiro
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
