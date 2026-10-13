import React, { useState } from 'react';
import { Plus, SlidersHorizontal, Utensils } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onSelectProduct(product);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-[#161619] hover:bg-[#1a1a1e] border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
    >
      {/* Product Image Box */}
      <div className="relative aspect-[4/3] w-full bg-zinc-900 overflow-hidden">
        {!imageError ? (
          <img
            src={product.url_imagem}
            alt={product.nome}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500 p-4 text-center">
            <Utensils className="w-8 h-8 text-amber-500/60 mb-2" />
            <span className="text-xs font-medium text-zinc-400">{product.nome}</span>
          </div>
        )}

        {/* Gradient shadow for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

        {/* Badges / Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.tag && (
            <span className="text-[10px] font-bold tracking-tight uppercase px-2 py-0.5 rounded-md bg-amber-500 text-black shadow-md">
              {product.tag}
            </span>
          )}
          {product.permite_adicionais && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-zinc-900/80 backdrop-blur-sm text-zinc-300 border border-zinc-700/60">
              Personalizável
            </span>
          )}
        </div>

        {/* Price tag over image bottom on mobile */}
        <div className="absolute bottom-2.5 right-2.5 sm:hidden bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-500/30 text-amber-400 font-extrabold text-xs">
          {formatCurrency(product.preco)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors line-clamp-1">
              {product.nome}
            </h3>
          </div>

          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.descricao}
          </p>
        </div>

        {/* Footer with Price & Button */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">A partir de</span>
            <span className="text-base sm:text-lg font-black text-amber-400 font-mono tracking-tight">
              {formatCurrency(product.preco)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {product.permite_adicionais ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Montar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(product);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700/80 hover:border-amber-500 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pedir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
