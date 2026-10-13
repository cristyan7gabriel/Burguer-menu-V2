import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-zinc-500">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome ou ingrediente... Ex: Bacon, Cheddar, Angus, Fritas"
          className="w-full bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors"
            title="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {searchTerm.trim() && (
        <div className="text-xs text-zinc-400 mt-2 px-1 flex items-center justify-between">
          <span>
            Mostrando resultados para: <strong className="text-amber-400">"{searchTerm}"</strong>
          </span>
          <span className="text-zinc-500">
            {resultCount} {resultCount === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
        </div>
      )}
    </div>
  );
};
