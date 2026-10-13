import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, FileCode, Sparkles } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      const res = await fetch('/standalone.html');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/standalone.html';
    link.download = 'cardapio-burger-house.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#161619] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Arquivo index.html Standalone Único</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-normal">
                  Zero Dependências
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                100% autocontido (HTML5 + Tailwind CDN + Lucide Icons + JS Nativo)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-zinc-300">
          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl space-y-1.5 text-amber-200">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-4 h-4" />
              Modelo Comercial Pronto para Vender
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Este arquivo contém <strong>todo o código do cardápio em um único arquivo .html</strong>.
              Você pode enviar por WhatsApp para o dono da lanchonete abrir no celular dele, hospedar gratuitamente no Vercel/Netlify/GitHub Pages com 1 clique, ou rodar direto do disco!
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              O que está incluído no arquivo:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400">
              <li className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Tailwind CSS via CDN oficial</span>
              </li>
              <li className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Ícones Lucide via script CDN</span>
              </li>
              <li className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>11 Produtos com fotos reais Unsplash</span>
              </li>
              <li className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Modal de montagem com adicionais</span>
              </li>
              <li className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Checkout Delivery vs Retirada</span>
              </li>
              <li className="flex items-center gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Disparo padronizado para WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Baixar index.html</span>
            </button>

            <a
              href="/standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-zinc-400" />
              <span>Abrir em Nova Aba</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
