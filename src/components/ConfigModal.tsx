import React, { useState } from 'react';
import { X, Check, Settings, Phone, Store, DollarSign, Clock, RotateCcw } from 'lucide-react';
import { StoreConfig } from '../types';
import { STORE_CONFIG_DEFAULT } from '../data/products';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onSaveConfig: (newConfig: StoreConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<StoreConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    setFormData({ ...STORE_CONFIG_DEFAULT });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#161619] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                Configurações da Loja
              </h2>
              <span className="text-[11px] text-zinc-400">
                Ajuste para demonstrar ao seu cliente
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-zinc-300 font-bold block mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              WhatsApp da Loja (Para onde o pedido vai)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="Ex: 5511999998888 (com DDI 55)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Dica comercial: Coloque o número do dono da hamburgueria para ele receber o pedido de teste na hora!
            </span>
          </div>

          <div>
            <label className="text-zinc-300 font-bold block mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-bold block mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                Taxa de Entrega (R$)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.taxaEntrega}
                onChange={(e) =>
                  setFormData({ ...formData, taxaEntrega: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-bold block mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Tempo Estimado
              </label>
              <input
                type="text"
                value={formData.tempoEstimado}
                onChange={(e) => setFormData({ ...formData, tempoEstimado: e.target.value })}
                placeholder="35 - 50 min"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-bold block mb-1">
              Horário de Funcionamento
            </label>
            <input
              type="text"
              value={formData.horarioFuncionamento}
              onChange={(e) => setFormData({ ...formData, horarioFuncionamento: e.target.value })}
              placeholder="18:00 às 23:30"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
            <div>
              <span className="font-bold text-white block">Status da Loja</span>
              <span className="text-[10px] text-zinc-400">
                {formData.aberto ? 'Loja aberta para novos pedidos' : 'Loja fechada temporariamente'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, aberto: !formData.aberto })}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                formData.aberto
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {formData.aberto ? 'Aberto' : 'Fechado'}
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors cursor-pointer"
              title="Restaurar padrão"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <span>Salvar Configurações</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
