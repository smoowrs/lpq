import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Package, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Components
import { CheckoutModal } from './components/CheckoutModal';
import { translations } from "./translations";
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';

// Lazy Loaded Sections
const Comunidade = lazy(() => import('./sections/Comunidade'));
const Minerador = lazy(() => import('./sections/Minerador'));
const Produtos = lazy(() => import('./sections/Produtos'));
const Aulas = lazy(() => import('./sections/Aulas'));
const Fabricas = lazy(() => import('./sections/Fabricas'));
const Ranking = lazy(() => import('./sections/Ranking'));
const Rastreio = lazy(() => import('./sections/Rastreio'));
const ConnectAI = lazy(() => import('./sections/ConnectAI'));
const Planos = lazy(() => import('./sections/Planos'));
const FAQ = lazy(() => import('./sections/FAQ'));
const Footer = lazy(() => import('./sections/Footer'));

type Language = 'pt' | 'pt-PT' | 'en' | 'es' | 'fr';

// Placeholder for lazy sections to avoid CLS
const SectionPlaceholder = ({ height = "400px" }: { height?: string }) => (
  <div style={{ height, background: 'black', width: '100%' }} className="animate-pulse opacity-20" />
);

export default function App() {
  const [trackingStep, setTrackingStep] = useState(0);
  const [language, setLanguage] = useState<Language>('pt');
  const [hasDetectedRegion, setHasDetectedRegion] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [region, setRegion] = useState<'brasil' | 'europa'>('brasil');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Auto-detect region & language with performance optimization
  useEffect(() => {
    if (hasDetectedRegion) return;
    
    const detect = async () => {
      let isEurope = false;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for IP API

      try {
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        const data = await res.json();
        if (data.continent_code === 'EU') {
          isEurope = true;
        }
        clearTimeout(timeoutId);
      } catch (err) {
        // Fallback to Timezone detection
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && (tz.startsWith('Europe/') || tz.startsWith('Africa/'))) {
          isEurope = true;
        }
      } finally {
        const navLang = navigator.language.toLowerCase();
        
        if (isEurope) {
          setRegion('europa');
          if (navLang.startsWith('es')) setLanguage('es');
          else if (navLang.startsWith('fr')) setLanguage('fr');
          else if (navLang === 'pt-pt' || navLang === 'pt_pt') setLanguage('pt-PT');
          else if (navLang.startsWith('pt')) setLanguage('pt');
          else setLanguage('en');
        } else {
          if (navLang.startsWith('es')) { setLanguage('es'); setRegion('europa'); }
          else if (navLang.startsWith('fr')) { setLanguage('fr'); setRegion('europa'); }
          else if (navLang === 'pt-pt' || navLang === 'pt_pt') { setLanguage('pt-PT'); setRegion('europa'); }
          else if (navLang.startsWith('en')) { setLanguage('en'); setRegion('europa'); }
          else { setLanguage('pt'); setRegion('brasil'); }
        }
        
        setHasDetectedRegion(true);
      }
    };
    detect();
  }, [hasDetectedRegion]);

  const t = translations[language];

  // Static tracking data
  const trackingStages = [
    { icon: <Package className="w-4 h-4" /> },
    { icon: <MapPin className="w-4 h-4" /> },
    { icon: <ShieldCheck className="w-4 h-4" /> },
    { icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  // Click outside handler for language menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Tracking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToPlanos = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById('planos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanClick = (planId: string) => {
    const planData = t.planos[planId as keyof typeof t.planos];
    setSelectedPlan({ ...planData, id: planId });
    setIsCheckoutOpen(true);
    
    // Track initiation for Pixel/Analytics
    import('./utils/fb-events').then(({ trackFBEvent }) => {
      trackFBEvent('InitiateCheckout', {
        content_name: planData.name,
        value: parseFloat((planData.monthlyPrice || planData.price || '0').replace(',', '.')),
        currency: region === 'brasil' ? 'BRL' : 'EUR'
      });
    });
  };

  useEffect(() => {
    // Analytics PageView
    import('./utils/fb-events').then(({ trackFBEvent }) => {
      trackFBEvent('PageView');
    });
  }, [language]); // Retrack if language changes for better tracking

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-[#F5F5F7] selection:bg-white/20 flex flex-col">
      <Toaster position="top-right" />
      
      <AnimatePresence>
        {isCheckoutOpen && selectedPlan && (
          <CheckoutModal 
            plan={selectedPlan} 
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={() => {}}
          />
        )}
      </AnimatePresence>

      <Navbar 
        t={t} 
        language={language} 
        setLanguage={setLanguage} 
        isLangMenuOpen={isLangMenuOpen} 
        setIsLangMenuOpen={setIsLangMenuOpen} 
        langMenuRef={langMenuRef} 
        scrollToPlanos={scrollToPlanos}
      />

      <main>
        <Hero t={t} scrollToPlanos={scrollToPlanos} />

        <Suspense fallback={<SectionPlaceholder height="600px" />}>
          <Comunidade t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="500px" />}>
          <Minerador t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="500px" />}>
          <Produtos t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="700px" />}>
          <Aulas t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="500px" />}>
          <Fabricas t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="400px" />}>
          <Ranking t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="600px" />}>
          <Rastreio 
            t={t} 
            scrollToPlanos={scrollToPlanos} 
            trackingStages={trackingStages} 
            trackingStep={trackingStep} 
          />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="500px" />}>
          <ConnectAI t={t} scrollToPlanos={scrollToPlanos} />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="800px" />}>
          <Planos 
            t={t} 
            billingCycle={billingCycle} 
            setBillingCycle={setBillingCycle} 
            region={region} 
            handlePlanClick={handlePlanClick} 
          />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="500px" />}>
          <FAQ t={t} />
        </Suspense>
      </main>

      <Suspense fallback={<SectionPlaceholder height="300px" />}>
        <Footer t={t} language={language} setLanguage={setLanguage as any} />
      </Suspense>
    </div>
  );
}
