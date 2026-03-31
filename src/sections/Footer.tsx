import { Globe } from 'lucide-react';

interface FooterProps {
  t: any;
  language: string;
  setLanguage: (lang: 'pt' | 'en') => void;
}

export default function Footer({ t, language, setLanguage }: FooterProps) {
  return (
    <footer className="py-20 md:py-32 relative overflow-hidden bg-black border-t border-white/5 order-12 md:order-none">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-[#582ef5]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="https://i.postimg.cc/t4CHMJzj/brancalogo.png" alt="Connect Academy" className="h-8 md:h-10 object-contain relative z-10" loading="lazy" decoding="async" />
          </div>
          <p className="text-sm text-gray-500 max-w-sm mb-0">
            {t.footer.copy}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#582ef5] mb-4">{t.footer.termsTitle}</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{t.footer.terms}</a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{t.footer.privacy}</a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4">{t.footer.supportTitle}</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:contato@connectacademy.com.br" className="text-sm text-gray-500 hover:text-white transition-colors">contato@connectacademy.com.br</a>
              <a href="https://wa.me/5562996163351" className="text-sm text-gray-400 font-black hover:text-white transition-all">WhatsApp Suporte</a>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex bg-[#0a0a0a] border border-white/5 p-1 rounded-xl shadow-2xl">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${language === 'pt' ? 'bg-[#582ef5] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Globe className="w-3 h-3" /> PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${language === 'en' ? 'bg-[#582ef5] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Globe className="w-3 h-3" /> EN
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
          <img src="https://i.postimg.cc/DZcqskjG/IMG_3713_3.png" alt="Drone Connect Academy" className="h-8 object-contain" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
        </div>
        <p className="text-[10px] text-gray-600 font-medium text-center uppercase tracking-[0.2em]">
          connect academy group © 2024 • todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
