import { motion } from 'motion/react';
import { Package, Sparkles, Users, ShieldCheck,
  ArrowRight, PlayCircle, CheckCircle2,
  Clock, MapPin, Play,
  Crown, Star, ChevronDown, Check,
  Factory, X, Globe
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { CheckoutModal } from './components/CheckoutModal';

type Language = 'pt' | 'en' | 'es';

const translations = {
  pt: {
    nav: { login: "Entrar", create: "Criar conta grátis", create_short: "Criar conta", lang: "Português", community: "Rede Social", products: "Produtos", ai: "Connect AI", tracking: "Rastreio" },
    hero: {
      sparkle: "A revolução da importação com IA",
      title1: "Economize ou Lucre",
      title2: "Importando Produtos",
      title3: "Direto da China 🌏",
      titleMob: "Importando da China 🌏",
      desc: "Crie sua conta grátis e aprenda a importar da China! Tenha acesso a aulas exclusivas, rastreio em tempo real, gerador de imagens e ao Minerador: a IA desenvolvida para evitar taxas abusivas, participe de nossa comunidade de networking e utilize diversas outras ferramentas",
      btnCreate: "Criar conta grátis",
      btnWork: "Ver como funciona"
    },
    comunidade: {
      tag: "COMUNIDADE",
      title1: "A 1ª Rede Social",
      title2: "do Importador 💙",
      desc: "Sua nova rede social, uma comunidade exclusiva para importadores e empreendedores, troque informações estratégicas, compartilhe seus resultados e evolua ao lado de quem fala a sua língua.",
      btn: "Testar comunidade"
    },
    produtos: {
      tag: "PRODUTOS",
      title1: "Os melhores produtos",
      title2: "qualidades e preços 🔥",
      desc: "Tenha acesso grátis a um painel cheio de produtos incríveis.",
      btn: "Ver produtos"
    },
    aulas: {
      tag: "AULAS PASSO A PASSO",
      title1: "Aprenda a",
      title2: "importar do zero.",
      titleMob: "Aprenda importar do zero ✈️",
      desc: "Do primeiro acesso até a chegada dos produtos na porta da sua casa ou da sua loja.",
      btn: "Começar agora",
      items: ['Configuração de endereço na China', 'Como comprar de forma segura', 'Gestão de envios e rastreio', 'Estratégias para evitar taxas']
    },
    fabricas: {
      tag: "FÁBRICAS",
      title1: "Os maiores",
      title2: "fabricantes e lojas",
      title3: "da China",
      titleMob1: "Os maiores fábricantes",
      titleMob2: "e lojas da China 🛒",
      desc: "Um painel com fabricantes e fornecedores confiáveis e com extrema agilidade de entrega, crie sua conta grátis e acesse nossas fábricas.",
      btn: "Ver fábricas"
    },
    minerador: {
      tag: "O MINERADOR",
      title1: "O Assistente",
      title2: "inteligente 💬",
      desc: "Nossa IA ajuda você a encontrar as melhores fábricas em nosso painel de parceiros confiáveis e automatiza todas as declarações, livrando você de taxas surpresas.",
      btn: "Testar Minerador Agora",
      chat: {
        status: "IA Online agora",
        q: "Preciso de link de iphone 17 pro max",
        a: "Encontrei fornecedores verificados com estoque disponível e envio direto! 🚀",
        btn: "ACESSAR LINK",
        input: "Pergunte ao Minerador..."
      }
    },
    recompensas: {
      tag: "NÍVEIS E RECOMPENSAS",
      title1: "Suba de nível e",
      title2: "ganhe prêmios",
      btn: "Subir níveis"
    },
    rastreio: {
      tag: "LOGÍSTICA INTELIGENTE",
      title1: "Rastreio em",
      title2: "Tempo Real.",
      titleMob: "Rastreio em Tempo Real 🗺️",
      desc: "Nosso sistema se conecta diretamente com as transportadoras internacionais e Correios para te dar atualizações precisas e automáticas.",
      btn: "Testar rastreio grátis",
      status: "Status do Pedido",
      moving: "Em trânsito",
      items: ['Notificações push a cada movimentação', 'Previsão de entrega com IA', 'Alerta automático de taxas'],
      stages: [
        { title: "Postado na China", time: "09:41 AM" },
        { title: "Chegou no Brasil", time: "14:20 PM" },
        { title: "Fiscalização Concluída", time: "10:15 AM" },
        { title: "Saiu para Entrega", time: "08:30 AM" }
      ]
    },
    connectAI: {
      tag: "CONNECT AI",
      title1: "Crie imagens que",
      title2: "vendem mais.",
      desc: "Com o uso da Connect AI você transforma fotos simples de fornecedores em imagens que realmente geram interesse e um visual incrível na sua loja.",
      items: ['Imagens em 4K', 'Menos de 30s', 'Alta Conversão'],
      btn: "Testar Connect AI"
    },
    cupom: {
      title1: "REGISTRE-SE e GANHE",
      title2: "R$660 em CUPONS",
      desc: "Aproveite essa oferta exclusiva de boas-vindas. Resgate agora seus cupons de desconto exclusivos e economize nas suas primeiras importações.",
      btn: "Resgatar cupom",
      badges: ["Imediato", "Única", "VIP Connect"]
    },
    footer: { rights: "Todos os direitos reservados", terms: "Termos", privacy: "Privacidade" },
    planos: {
      tag: "PLANOS DE ACESSO",
      title: "Escolha o seu plano",
      monthly: "Mensal",
      annual: "Anual",
      annualOff: "50% OFF",
      brasil: "Brasil",
      europa: "Europa",
      btnActive: "PLANO ATIVO",
      btnSelect: "ASSINAR ESSE PLANO",
      free: {
        name: "Experience 💙",
        desc: "Uma forma simples de conhecer a estrutura por dentro e entender se faz sentido para você antes de seguir para a experiência completa.",
        price: "0",
        period: "/mês",
        btnTest: "Testar Grátis",
        items: [
          { text: "Roupas, Tênis & Acessórios (Não inclui produtos Apple e nem eletrônicos).", status: true },
          { text: "Um painel com produtos atualizados", status: true },
          { text: "Rastreio em tempo real de até 2 envios.", status: true },
          { text: "Módulos de aulas", status: true },
          { text: "Acesso a Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global", status: false },
          { text: "Baixar imagens ilimitadas", status: false },
          { text: "Painel de fábricas e produtos exclusivos não divulgados publicamente.", status: false },
          { text: "Gerador de imagens 4K (10 créditos mensais).", status: false },
          { text: "Inteligência Artificial o Minerador de buscas e perguntas.", status: false },
          { text: "Acesso aos marketplaces locais na China.", status: false },
          { text: "Sem limites de rastreios de envios.", status: false },
          { text: "Acesso à comunidade.", status: false },
          { text: "Prioridade no suporte (topo da lista).", status: false },
          { text: "Medalha de destaque na comunidade.", status: false },
          { text: "Alertas e oportunidades em primeira mão.", status: false },
          { text: "Sorteios mensais e premiações.", status: false },
          { text: "Sistema Indique e Ganhe.", status: false },
        ]
      },
      starter: {
        name: "STARTER 🪙",
        desc: "Acesso essencial para começar suas importações.",
        price: "29,90",
        monthlyPrice: "29,90",
        period: "/mês",
        info: "PAGAMENTO ÚNICO DE R$ 179,40",
        items: [
          { text: "Acesso às fábricas diretas na China.", status: true },
          { text: "Roupas, Tênis, Relógios, Bonés, Óculos, Meias, Bolsas, Perfumes, Ferramentas, Pesca, Eletrônicos, Periféricos, Acessórios para celular, Iluminação, Casa e Cozinha, Decoração, Brinquedos, Papelaria, Pet, Beleza, Maquiagem, Automotivo, Esporte, Ciclismo, Fitness, Sex Shop, Joias, Jardinagem, Festa e Brindes. (Não inclui produtos Apple e nem eletrônicos).", status: true },
          { text: "Um painel com produtos atualizados", status: true },
          { text: "O Minerador (Inteligência artificial de buscas e perguntas).", status: true },
          { text: "Gerador de imagens 4K (3 créditos mensais).", status: true },
          { text: "Rastreio em tempo real de até 5 envios.", status: true },
          { text: "Módulos de aulas exclusivas.", status: true },
          { text: "Acesso à comunidade.", status: true },
          { text: "Sistema Indique e Ganhe.", status: true },
          { text: "Acesso a Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global", status: false },
          { text: "Baixar imagens ilimitadas", status: false },
          { text: "Acesso aos marketplaces locais na China", status: false },
          { text: "Prioridade no suporte (Topo da lista)", status: false },
          { text: "Medalha de destaque exclusiva na comunidade", status: false },
          { text: "Alertas e oportunidades em primeira mão", status: false },
          { text: "Sorteios mensais e premiações", status: false },
        ]
      },
      pro: {
        name: "PRO 🌏",
        desc: "O plano intermediário para quem busca variedade e ferramentas de IA.",
        price: "59,90",
        monthlyPrice: "59,90",
        period: "/mês",
        info: "PAGAMENTO ÚNICO DE R$ 359,40",
        items: [
          { text: "Acesso a fábricas exclusivas na China.", status: true },
          { text: "Roupas, Tênis, Relógios, Bonés, Óculos, Meias, Bolsas, Perfumes, Ferramentas, Pesca, Eletrônicos, Periféricos, Acessórios para celular, Iluminação, Casa e Cozinha, Decoração, Brinquedos, Papelaria, Pet, Beleza, Maquiagem, Automotivo, Esporte, Ciclismo, Fitness, Sex Shop, Joias, Jardinagem, Festa e Brindes. (Não inclui produtos Apple).", status: true },
          { text: "Gerador de imagens 4K (5 créditos mensais).", status: true },
          { text: "Inteligência Artificial o Minerador de buscas e perguntas.", status: true },
          { text: "Acesso aos marketplaces locais na China.", status: true },
          { text: "Rastreio em tempo real de até 10 envios.", status: true },
          { text: "Módulos de aulas exclusivas.", status: true },
          { text: "Acesso à comunidade.", status: true },
          { text: "Alertas e oportunidades em primeira mão.", status: true },
          { text: "Sorteios mensais e premiações.", status: true },
          { text: "Sistema Indique e Ganhe.", status: true },
          { text: "Acesso a Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global", status: false },
          { text: "Baixar imagens ilimitadas", status: false },
          { text: "Prioridade no suporte (Topo da lista)", status: false },
          { text: "Medalha de destaque exclusiva na comunidade", status: false },
        ]
      },
      elite: {
        name: "ELITE 🥇",
        desc: "Acesso total e suporte prioritário para escala máxima.",
        price: "99,90",
        monthlyPrice: "99,90",
        period: "/mês",
        info: "PAGAMENTO ÚNICO DE R$ 599,40",
        items: [
          { text: "Acesso a Apple oficial na China, produtos originais, lacrados, desbloqueados e com 1 ano de garantia global", status: true },
          { text: "Baixar imagens ilimitadas", status: true },
          { text: "Painel de fábricas e produtos exclusivos não divulgados publicamente.", status: true },
          { text: "Um painel com produtos atualizados", status: true },
          { text: "Acesso à origem de Eletrônicos, Gamer, Periféricos, Acessórios para Celular, Automotivo, Roupas, Tênis, Relógios, Perfumes, Bolsas, Joias, Óculos, Beleza, Maquiagem, Sex Shop, Fitness, Esporte, Ciclismo, Pesca, Casa e Cozinha, Decoração, Iluminação, Jardinagem, Ferramentas, Brinquedos, Papelaria, Pet, Festa e Brindes.", status: true },
          { text: "Gerador de imagens 4K (10 créditos mensais).", status: true },
          { text: "Inteligência Artificial o Minerador de buscas e perguntas.", status: true },
          { text: "Acesso aos marketplaces locais na China.", status: true },
          { text: "Sem limites de rastreios de envios.", status: true },
          { text: "Módulos de aulas exclusivas.", status: true },
          { text: "Acesso à comunidade.", status: true },
          { text: "Prioridade no suporte (topo da lista).", status: true },
          { text: "Medalha de destaque na comunidade.", status: true },
          { text: "Alertas e oportunidades em primeira mão.", status: true },
          { text: "Sorteios mensais e premiações.", status: true },
          { text: "Sistema Indique e Ganhe.", status: true },
        ]
      }
    }
  },
  en: {
    nav: { login: "Login", create: "Create free account", create_short: "Create account", lang: "English", community: "Community", products: "Products", ai: "Connect AI", tracking: "Tracking" },
    hero: {
      sparkle: "The import revolution with AI",
      title1: "Save or Profit",
      title2: "Importing Products",
      title3: "Direct from China 🌏",
      titleMob: "Import from China 🌏",
      desc: "Create your free account and learn how to import from China! Get access to exclusive classes, real-time tracking, image generator and the Minerador: the AI developed to avoid abusive taxes, participate in our networking community and use several other tools",
      btnCreate: "Create free account",
      btnWork: "See how it works"
    },
    comunidade: {
      tag: "COMMUNITY",
      title1: "The 1st Social Network",
      title2: "for Importers 💙",
      desc: "Your new social network, an exclusive community for importers and entrepreneurs, exchange strategic information, share your results and evolve alongside those who speak your language.",
      btn: "Test community"
    },
    produtos: {
      tag: "PRODUCTS",
      title1: "The best products",
      title2: "quality and prices 🔥",
      desc: "Get free access to a panel full of amazing products.",
      btn: "View products"
    },
    aulas: {
      tag: "STEP-BY-STEP CLASSES",
      title1: "Learn how to",
      title2: "import from zero.",
      titleMob: "Learn to import from zero ✈️",
      desc: "From the first access until the products arrive at your doorstep or your store.",
      btn: "Start now",
      items: ['China address setup', 'How to buy safely', 'Shipping and tracking management', 'Tax avoidance strategies']
    },
    fabricas: {
      tag: "FACTORIES",
      title1: "The biggest",
      title2: "manufacturers and stores",
      title3: "from China",
      titleMob1: "The biggest manufacturers",
      titleMob2: "and shops in China 🛒",
      desc: "A panel with reliable manufacturers and suppliers with extreme delivery agility, create your free account and access our factories.",
      btn: "View factories"
    },
    minerador: {
      tag: "THE MINER",
      title1: "The intelligent",
      title2: "Assistant 💬",
      desc: "Our AI helps you find the best factories in our trusted partner panel and automates all declarations, freeing you from surprise fees.",
      btn: "Test Miner Now",
      chat: {
        status: "AI Online now",
        q: "I need a link for iphone 17 pro max",
        a: "Found verified suppliers with stock available and direct shipping! 🚀",
        btn: "ACCESS LINK",
        input: "Ask the Miner..."
      }
    },
    recompensas: {
      tag: "LEVELS AND REWARDS",
      title1: "Level up and",
      title2: "win prizes",
      btn: "Level up"
    },
    rastreio: {
      tag: "SMART LOGISTICS",
      title1: "Real-Time",
      title2: "Tracking.",
      titleMob: "Real-Time Tracking 🗺️",
      desc: "Our system connects directly with international carriers and postal services to give you precise and automatic updates.",
      btn: "Test track for free",
      status: "Order Status",
      moving: "In transit",
      items: ['Push notifications for every move', 'AI delivery prediction', 'Automatic tax alerts'],
      stages: [
        { title: "Posted in China", time: "09:41 AM" },
        { title: "Arrived in Brazil", time: "02:20 PM" },
        { title: "Customs Completed", time: "10:15 AM" },
        { title: "Out for Delivery", time: "08:30 AM" }
      ]
    },
    connectAI: {
      tag: "CONNECT AI",
      title1: "Create images that",
      title2: "sell more.",
      desc: "With Connect AI you transform simple supplier photos into images that really generate interest and an amazing look in your store.",
      items: ['4K Images', 'Under 30s', 'High Conversion'],
      btn: "Test Connect AI"
    },
    cupom: {
      title1: "REGISTER and WIN",
      title2: "$150 in COUPONS",
      desc: "Take advantage of this exclusive welcome offer. Redeem your exclusive discount coupons now and save on your first imports.",
      btn: "Redeem coupon",
      badges: ["Immediate", "Unique", "Connect VIP"]
    },
    footer: { rights: "All rights reserved", terms: "Terms", privacy: "Privacy" },
    planos: {
      tag: "ACCESS PLANS",
      title: "Choose your plan",
      monthly: "Monthly",
      annual: "Annual",
      annualOff: "-50%",
      brasil: "BRAZIL",
      europa: "EUROPE",
      btnActive: "ACTIVE PLAN",
      btnSelect: "SUBSCRIBE TO THIS PLAN",
      free: {
        name: "Experience 💙",
        desc: "A simple way to discover the platform from the inside and understand if it makes sense for you before moving to the full experience.",
        price: "0",
        period: "/mo",
        items: [
          { text: "Access to direct factories in China.", status: true },
          { text: "Exclusive class modules.", status: true },
          { text: "Real-time tracking of up to 2 shipments.", status: true },
          { text: "Clothing, Sneakers and accessories", status: false },
        ]
      },
      starter: {
        name: "STARTER 🪙",
        desc: "Essential access for starting your imports.",
        price: "14.95",
        monthlyPrice: "29.90",
        period: "/mo",
        info: "SINGLE PAYMENT OF R$ 179.40",
        items: [
          { text: "Access to direct factories in China.", status: true },
          { text: "Clothing, Sneakers, Watches, Caps...", status: true },
          { text: "The Miner (Search AI).", status: true },
          { text: "4K Image Generator (3 credits).", status: true },
          { text: "Real-time tracking up to 5 shipments.", status: true },
          { text: "Exclusive class modules.", status: true },
          { text: "Community access.", status: true },
          { text: "Refer and Earn system.", status: true },
          { text: "Apple products and Electronics", status: false },
          { text: "Download unlimited images", status: false },
        ]
      },
      pro: {
        name: "PRO 🌏",
        desc: "The intermediate plan for more variety and AI tools.",
        price: "29.95",
        monthlyPrice: "59.90",
        period: "/mo",
        info: "SINGLE PAYMENT OF R$ 359.40",
        items: [
          { text: "Access to exclusive factories in China.", status: true },
          { text: "Clothing, Sneakers, Watches and Electronics.", status: true },
          { text: "4K Image Generator (5 credits).", status: true },
          { text: "The Miner (Search AI).", status: true },
          { text: "Local marketplaces in China.", status: true },
          { text: "Real-time tracking up to 10 shipments.", status: true },
          { text: "Exclusive class modules.", status: true },
          { text: "Community access.", status: true },
          { text: "Alerts and opportunities.", status: true },
          { text: "Monthly sweepstakes and prizes.", status: true },
          { text: "Official Apple Access", status: false },
        ]
      },
      elite: {
        name: "ELITE 🥇",
        desc: "Full access and priority support for maximum scale.",
        price: "49.95",
        monthlyPrice: "99.90",
        period: "/mo",
        info: "SINGLE PAYMENT OF R$ 599.40",
        items: [
          { text: "Official Apple access in China (Original, global warranty).", status: true },
          { text: "Download unlimited images.", status: true },
          { text: "Exclusive factories and products dashboard.", status: true },
          { text: "Access to Electronics, Gamer, and 25+ product categories.", status: true },
          { text: "4K Image Generator (10 monthly credits).", status: true },
          { text: "The Miner AI (Smart search and questions).", status: true },
          { text: "Local marketplaces in China.", status: true },
          { text: "No shipping tracking limits.", status: true },
          { text: "Exclusive class modules.", status: true },
          { text: "Community access.", status: true },
          { text: "Priority support (Top of the list).", status: true },
          { text: "Exclusive highlight medal.", status: true },
          { text: "First-hand alerts and opportunities.", status: true },
          { text: "Monthly sweepstakes and prizes.", status: true },
          { text: "Refer and Earn system.", status: true },
        ]
      }
    }
  },
  es: {
    nav: { login: "Entrar", create: "Crear cuenta gratis", create_short: "Crear cuenta", lang: "Español", community: "Comunidad", products: "Productos", ai: "Connect AI", tracking: "Rastreo" },
    hero: {
      sparkle: "La revolución de la importación con IA",
      title1: "Ahorra o Gana",
      title2: "Importando Productos",
      title3: "Directo de China 🌏",
      titleMob: "Importar de China 🌏",
      desc: "¡Crea tu cuenta gratis y aprende a importar de China! Ten acceso a clases exclusivas, rastreo en tiempo real, generador de imágenes y al Minerador: la IA desarrollada para evitar tasas abusivas, participa en nuestra comunidad de networking y utiliza diversas herramientas",
      btnCreate: "Crear cuenta gratis",
      btnWork: "Ver cómo funciona"
    },
    comunidade: {
      tag: "COMUNIDAD",
      title1: "La 1ª Red Social",
      title2: "del Importador 💙",
      desc: "Tu nueva red social, una comunidad exclusiva para importadores y emprendedores, intercambia información estratégica, comparte tus resultados y evoluciona junto a quienes hablan tu idioma.",
      btn: "Probar comunidad"
    },
    produtos: {
      tag: "PRODUCTOS",
      title1: "Los mejores productos",
      title2: "calidad y precios 🔥",
      desc: "Obtén acceso gratuito a un panel lleno de productos increíbles.",
      btn: "Ver produtos"
    },
    aulas: {
      tag: "CLASES PASO A PASO",
      title1: "Aprende a",
      title2: "importar desde cero.",
      titleMob: "Aprenda a importar desde cero ✈️",
      desc: "Desde el primer acceso hasta que los productos llegan a tu casa o a tu tienda.",
      btn: "Comenzar ahora",
      items: ['Configuración de dirección en China', 'Cómo comprar de forma segura', 'Gestión de envíos y rastreo', 'Estrategias para evitar impuestos']
    },
    fabricas: {
      tag: "FÁBRICAS",
      title1: "Los mayores",
      title2: "fabricantes y tiendas",
      title3: "de China",
      titleMob1: "Los mayores fabricantes",
      titleMob2: "y tiendas de China 🛒",
      desc: "Un panel de fabricantes y proveedores fiables y con una agilidad de entrega extrema, crea tu cuenta gratuita y accede a nuestras fábricas.",
      btn: "Ver fábricas"
    },
    minerador: {
      tag: "EL MINERO",
      title1: "El Asistente",
      title2: "inteligente 💬",
      desc: "Nuestra IA te ayuda a encontrar las mejores fábricas en nuestro panel de socios confiables y automatiza todas las declaraciones, librándote de cargos sorpresa.",
      btn: "Probar Minero Ahora",
      chat: {
        status: "IA En línea ahora",
        q: "Necesito link de iphone 17 pro max",
        a: "¡Encontré proveedores verificados con stock disponible y envío directo! 🚀",
        btn: "ACCEDER LINK",
        input: "Pregunta al Minero..."
      }
    },
    recompensas: {
      tag: "NIVELES Y RECOMPENSAS",
      title1: "Sube de nivel y",
      title2: "gana premios",
      btn: "Subir niveles"
    },
    rastreio: {
      tag: "LOGÍSTICA INTELIGENTE",
      title1: "Rastreo en",
      title2: "Tiempo Real.",
      titleMob: "Rastreo en Tiempo Real 🗺️",
      desc: "Nuestro sistema se conecta directamente con los transportistas internacionales y correos para brindarte actualizaciones precisas y automáticas.",
      btn: "Probar rastreo gratis",
      status: "Estado del Pedido",
      moving: "En tránsito",
      items: ['Notificaciones push en cada movimiento', 'Predicción de entrega con IA', 'Alerta automática de tasas'],
      stages: [
        { title: "Publicado en China", time: "09:41 AM" },
        { title: "Llegó a Brasil", time: "14:20 PM" },
        { title: "Aduana Completada", time: "10:15 AM" },
        { title: "Salió para Entrega", time: "08:30 AM" }
      ]
    },
    connectAI: {
      tag: "CONNECT AI",
      title1: "Crea imágenes que",
      title2: "venden más.",
      desc: "Con el uso de Connect AI transformas simples fotos de proveedores en imágenes que realmente generan interés y un aspecto increíble en tu tienda.",
      items: ['Imágenes en 4K', 'Menos de 30s', 'Alta Conversión'],
      btn: "Probar Connect AI"
    },
    cupom: {
      title1: "REGÍSTRATE y GANA",
      title2: "$130 en CUPONES",
      desc: "Aprovecha esta oferta de bienvenida exclusiva. Canjea tus cupones de descuento exclusivos ahora y ahorra en tus primeras importaciones.",
      btn: "Canjear cupón",
      badges: ["Inmediato", "Única", "VIP Connect"]
    },
    footer: { rights: "Todos los derechos reservados", terms: "Términos", privacy: "Privacidad" },
    planos: {
      tag: "PLANES DE ACCESO",
      title: "Elige tu plan",
      monthly: "Mensual",
      annual: "Anual",
      annualOff: "-50%",
      brasil: "BRASIL",
      europa: "EUROPA",
      btnActive: "PLAN ACTIVO",
      btnSelect: "SUSCRIBIRSE A ESTE PLAN",
      free: {
        name: "Experience 💙",
        desc: "Una forma sencilla de conocer la plataforma por dentro y entender si tiene sentido para ti antes de pasar a la experiencia completa.",
        price: "0",
        period: "/mes",
        items: [
          { text: "Acceso a fábricas directas en China.", status: true },
          { text: "Módulos de clases exclusivas.", status: true },
          { text: "Rastreo en tiempo real de hasta 2 envíos.", status: true },
          { text: "Ropa, Zapatillas y accesorios", status: false },
        ]
      },
      starter: {
        name: "STARTER 🪙",
        desc: "Acceso esencial para comenzar sus importaciones.",
        price: "14.95",
        monthlyPrice: "29.90",
        period: "/mes",
        info: "PAGO ÚNICO DE R$ 179,40",
        items: [
          { text: "Acceso a fábricas directas en China.", status: true },
          { text: "Ropa, Zapatillas, Relojes, Gorras...", status: true },
          { text: "El Minero (IA de búsqueda).", status: true },
          { text: "Generador de imágenes 4K (3 créditos).", status: true },
          { text: "Rastreo en tiempo real de hasta 5 envíos.", status: true },
          { text: "Módulos de clases exclusivas.", status: true },
          { text: "Acceso a la comunidad.", status: true },
          { text: "Sistema Recomienda y Gana.", status: true },
          { text: "Productos Apple y Electrónicos", status: false },
          { text: "Descargar imágenes ilimitadas", status: false },
        ]
      },
      pro: {
        name: "PRO 🌏",
        desc: "El plan intermedio para quienes buscan variedad y herramientas de IA.",
        price: "29.95",
        monthlyPrice: "59.90",
        period: "/mes",
        info: "PAGO ÚNICO DE R$ 359,40",
        items: [
          { text: "Acceso a fábricas exclusivas en China.", status: true },
          { text: "Ropa, Zapatillas, Relojes y Electrónica.", status: true },
          { text: "Generador de imágenes 4K (5 créditos).", status: true },
          { text: "El Minero (IA de búsqueda).", status: true },
          { text: "Marketplaces locales en China.", status: true },
          { text: "Rastreo en tiempo real de hasta 10 envíos.", status: true },
          { text: "Módulos de clases exclusivas.", status: true },
          { text: "Acceso a la comunidad.", status: true },
          { text: "Alertas y oportunidades.", status: true },
          { text: "Sorteos mensuales y premios.", status: true },
          { text: "Acceso a Apple oficial", status: false },
        ]
      },
      elite: {
        name: "ELITE 🥇",
        desc: "Acceso total y soporte prioritario para escala máxima.",
        price: "49.95",
        monthlyPrice: "99.90",
        period: "/mes",
        info: "PAGO ÚNICO DE R$ 599,40",
        items: [
          { text: "Acceso oficial de Apple en China.", status: true },
          { text: "Descargas de imágenes ilimitadas.", status: true },
          { text: "Fábricas y productos exclusivos.", status: true },
          { text: "Origen de Electrónica y Gamer.", status: true },
          { text: "Generador de imágenes 4K (10 créditos).", status: true },
          { text: "El Minero (IA de búsqueda).", status: true },
          { text: "Marketplaces locales en China.", status: true },
          { text: "Sin límites de rastreo de envíos.", status: true },
          { text: "Prioridad en el soporte (superior).", status: true },
          { text: "Medalla de destaque exclusiva.", status: true },
        ]
      }
    }
  }
};

const flags: Record<Language, string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  es: "🇪🇸"
};

export default function App() {
  const [trackingStep, setTrackingStep] = useState(0);
  const [language, setLanguage] = useState<Language>('pt');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [region, setRegion] = useState<'brasil' | 'europa'>('brasil');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  const navLinks = [
    { name: t.nav.community, href: '#comunidade' },
    { name: "O Minerador", href: '#minerador' },
    { name: "Aulas", href: '#aulas' },
    { name: "Fábricas", href: '#fabricas' },
    { name: "Connect AI", href: '#ai' },
    { name: "Rastreio", href: '#rastreio' },
    { name: "Planos", href: '#planos' },
    { name: "Recompensas", href: '#ranking' },
  ];

  // ─── Dados estáticos fora do componente: sem recriação em cada render ───
  const trackingStages = [
    { icon: <Package className="w-4 h-4" /> },
    { icon: <MapPin className="w-4 h-4" /> },
    { icon: <ShieldCheck className="w-4 h-4" /> },
    { icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  // Fecha menu de idioma ao clicar fora (Mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  useEffect(() => {
    // Enviar evento de PageView inicial para Pixel e CAPI (Deduplicado)
    import('./utils/fb-events').then(({ trackFBEvent }) => {
      trackFBEvent('PageView');
    });
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-[#F5F5F7] selection:bg-white/20 flex flex-col">
      <Toaster position="top-right" />
      {isCheckoutOpen && selectedPlan && (
        <CheckoutModal 
          plan={selectedPlan} 
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            // Sucesso! O modal já mostra a tela de sucesso
          }}
        />
      )}

      {/* ─── NAV ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between relative gap-4">

          {/* Coluna 1: Logo (Desktop) / Idioma (Mobile) */}
          <div className="flex items-center justify-start z-30 min-w-max">
            {/* Logo Desktop */}
            <div className="hidden lg:block">
              <img
                src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
                alt="Asas de Importação"
                className="h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Mobile Idioma Selector */}
            <div className="lg:hidden relative z-50" ref={langMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all text-sm active:scale-90"
              >
                <span className="text-lg leading-none">{flags[language]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-44 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] animate-in fade-in zoom-in duration-200">
                  {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3.5 flex items-center gap-3 text-xs hover:bg-white/5 transition-colors ${language === lang ? 'text-white font-bold bg-white/5' : 'text-gray-400'}`}
                    >
                      <span className="text-lg leading-none">{flags[lang]}</span>
                      <span>{translations[lang].nav.lang}</span>
                      <div className="flex-1" />
                      {language === lang && <Check className="w-3.5 h-3.5 text-[#582ef5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna 2: Links (Desktop) / Logo (Mobile) */}
          <div className="flex items-center justify-center z-10">
            {/* Links Desktop */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[12px] xl:text-[14px] font-light tracking-wide text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Logo Mobile */}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <img
                src="https://i.postimg.cc/t4CHMJzj/brancalogo.png"
                alt="Asas de Importação"
                className="h-6 sm:h-7 object-contain pointer-events-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Coluna 3: CTAs / Idioma (Desktop) */}
          <div className="flex items-center justify-end gap-2 md:gap-4 z-30 min-w-max">
            <div className="flex items-center gap-1 sm:gap-4">
              <button
                onClick={() => window.location.href = 'https://app.connectacademy.com.br'}
                className="text-[11px] sm:text-[14px] md:text-[15px] font-bold text-gray-400 hover:text-white transition-colors px-2 py-2"
              >
                {t.nav.login}
              </button>
              <button
                onClick={scrollToPlanos}
                className="btn-primary px-3 sm:px-6 py-1.5 md:py-2.5 text-[11px] sm:text-[14px] md:text-[15px] font-bold whitespace-nowrap rounded-full md:rounded-xl shadow-lg shadow-[#582ef5]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="hidden sm:inline">{t.nav.create}</span>
                <span className="sm:hidden">{t.nav.create_short}</span>
              </button>
            </div>

            {/* Desktop Idioma Selector (Bem na direita) */}
            <div className="hidden lg:block relative group/lang">
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-all text-white/90">
                <span className="text-lg">{flags[language]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover/lang:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-44 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
                {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage(lang);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-xs hover:bg-white/5 transition-colors ${language === lang ? 'text-white font-bold bg-white/5' : 'text-gray-400'}`}
                  >
                    <span className="text-lg leading-none">{flags[lang]}</span>
                    <span>{translations[lang].nav.lang}</span>
                    <div className="flex-1" />
                    {language === lang && <Check className="w-3.5 h-3.5 text-[#582ef5]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-screen pt-20 pb-20 px-6 relative overflow-hidden border-b border-white/5 flex items-center justify-center">

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 relative z-10 w-full">

          {/* Lado Esquerdo (ou Mobile Top) */}
          <div className="md:w-[45%] flex flex-col items-center md:items-start text-center md:text-left w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center md:items-start"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(88,46,245,0.15)]">
                <Sparkles className="w-3 h-3 text-[#582ef5]" />
                <span className="text-gray-200">{t.hero.sparkle}</span>
              </div>

              <h1 className="text-[28px] md:text-5xl lg:text-[44px] xl:text-[56px] font-black tracking-tight mb-8 leading-[1.05] text-white">
                {/* Versão Desktop (3 linhas) */}
                <div className="hidden md:flex flex-col items-start">
                  <span className="whitespace-nowrap">{t.hero.title1}</span>
                  <span className="text-gradient-ai whitespace-nowrap">{t.hero.title2}</span>
                  <span className="whitespace-nowrap">{t.hero.title3}</span>
                </div>

                {/* Versão Mobile (2 linhas) */}
                <div className="flex md:hidden flex-col items-center">
                  <span className="whitespace-nowrap">{t.hero.title1}</span>
                  <span className="text-gradient-ai whitespace-nowrap">{t.hero.titleMob}</span>
                </div>
              </h1>

              {/* Vídeo apenas no MOBILE (Entre Título e Descrição) */}
              <div className="w-full mb-10 md:hidden relative">
                <div className="absolute -inset-6 z-0 pointer-events-none opacity-50">
                  <div className="ambilight-tl absolute top-0 left-0 w-3/5 h-3/5 blur-[40px] rounded-full bg-[#582ef5]/30" />
                  <div className="ambilight-br absolute bottom-0 right-0 w-3/5 h-3/5 blur-[40px] rounded-full bg-[#4c25e6]/30" />
                </div>
                <div className="relative z-10 w-full bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-1">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b"
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                      loading="eager"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[13px] sm:text-[14px] md:text-base text-gray-400 mb-10 max-w-xl leading-relaxed px-4 md:px-0 opacity-80">
                {t.hero.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPlanos}
                  className="btn-primary px-8 py-4.5 text-[15px] sm:text-[16px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 group whitespace-nowrap rounded-2xl shadow-[0_20px_50px_rgba(88,46,245,0.25)]"
                >
                  {t.hero.btnCreate}
                  <motion.div variants={{ initial: { x: 0 }, hover: { x: 5 } }}>
                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                  </motion.div>
                </motion.button>
                <motion.button
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToPlanos}
                  className="btn-secondary px-8 py-4.5 text-[15px] sm:text-[16px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl group whitespace-nowrap border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  {t.hero.btnWork}
                  <Play className="w-4 h-4 fill-white text-white" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Direita: Vídeo (Desk apenas) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative w-full md:w-[58%] mx-auto"
          >
            <div className="absolute -inset-10 z-0 pointer-events-none">
              <div className="ambilight-tl absolute top-0 left-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
              <div className="ambilight-tr absolute top-0 right-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
              <div className="ambilight-bl absolute bottom-0 left-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
              <div className="ambilight-br absolute bottom-0 right-0 w-3/5 h-3/5 blur-[80px] opacity-80 rounded-full" />
            </div>

            <div className="relative z-10 w-full bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-[0_0_80px_rgba(88,46,245,0.2)] overflow-hidden p-1 md:p-2">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <iframe
                  src="https://player-vz-e87e1287-fbb.tv.pandavideo.com.br/embed/?v=79d4adef-2ea8-45f0-8ed4-bdfb4a2d954b"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allowFullScreen
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── COMUNIDADE ────────────────────────────────────────── */}
      <section id="comunidade" className="pt-24 md:pt-32 pb-16 md:pb-40 px-6 relative overflow-hidden bg-black border-t border-white/5 order-2 md:order-none">
        {/* Glow de fundo atmosférico - Apenas Desktop agora */}
        <div className="hidden md:block absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#582ef5]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">

          {/* --- MOBILE LAYOUT --- */}
          <div className="md:hidden flex flex-col w-full mb-12">

            <div className="flex flex-row items-center w-full mt-4">
              {/* Lado Esquerdo: Imagem do Telefone (com animação de flutuação) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-[45%] flex relative items-center justify-center"
              >
                <motion.img
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="https://i.postimg.cc/3RkrkCVn/phones.png"
                  alt="App Comunidade"
                  className="w-[170px] xl:w-[200px] sm:w-[220px] max-w-none object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  loading="eager"
                  decoding="async"
                />
                {/* Degradê para sumir suavemente na base */}
                <div className="absolute inset-x-0 -bottom-10 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
              </motion.div>

              {/* Lado Direito: Textos e Botão com animação de surgimento */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-[55%] flex flex-col pl-4"
              >
                {/* Badge no Topo Direito (agora alinhado com os textos) */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-bold mb-4 md:mb-8 backdrop-blur-md uppercase tracking-[0.2em] text-gray-400 w-fit">
                  <Users className="w-3 h-3 text-[#582ef5]" />
                  <span>{t.comunidade.tag}</span>
                </div>

                <h2 className="text-[26px] font-bold tracking-tighter mb-4 leading-[1.05] text-white">
                  {t.comunidade.title1} <br />
                  <span className="whitespace-nowrap">{t.comunidade.title2}</span>
                </h2>
                <p className="text-[11px] sm:text-[13px] text-gray-400 mb-6 leading-relaxed opacity-80">
                  {t.comunidade.desc}
                </p>
                <button
                  onClick={scrollToPlanos}
                  className="w-full bg-[#582ef5] text-white py-3 sm:py-4 rounded-xl font-bold text-[13px] sm:text-[15px] flex items-center justify-center gap-2 hover:bg-[#4c25e6] active:scale-[0.98] transition-all"
                >
                  {t.comunidade.btn}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* --- DESKTOP LAYOUT --- */}
          <div className="hidden md:flex flex-row items-center justify-center gap-20">
            {/* Celular Desktop */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex w-1/2 justify-center z-20"
            >
              <div className="relative z-10 flex justify-center">
                <img
                  src="https://i.postimg.cc/3RkrkCVn/phones.png"
                  alt="App Comunidade"
                  className="w-full max-w-[520px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  loading="eager"
