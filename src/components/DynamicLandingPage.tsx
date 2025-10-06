'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import layoutService, { LayoutConfigResponse } from '@/services/layoutService';

export default function DynamicLandingPage() {
  const [layoutNumber, setLayoutNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchLayout = async () => {
    try {
      setLoading(true);
      const apiResponse: LayoutConfigResponse = await layoutService.getLayoutConfig();
      
      if (apiResponse.success && [0, 1, 2].includes(apiResponse.data.value)) {
        setLayoutNumber(apiResponse.data.value);
      } else {
        throw new Error('Layout inválido recebido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setLayoutNumber(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayout();
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const trackingData = Object.fromEntries(params.entries());
      
      const trackingParams = {
        utm_source: trackingData.utm_source || null,
        utm_medium: trackingData.utm_medium || null,
        utm_campaign: trackingData.utm_campaign || null,
        utm_term: trackingData.utm_term || null,
        utm_content: trackingData.utm_content || null,
        gclid: trackingData.gclid || null,
        fbclid: trackingData.fbclid || null,
      };
      
      const hasTrackingParams = Object.values(trackingParams).some(value => value !== null);
      
      if (hasTrackingParams) {
        console.log('🎯 Parâmetros de Tracking Detectados:', trackingParams);
      } else {
        console.log('📄 Nenhum parâmetro de tracking encontrado na URL');
      }
      
      if (Object.keys(trackingData).length > 0) {
        console.log('🔍 Todos os parâmetros da URL:', trackingData);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logic-green mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error && layoutNumber === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erro: {error}</p>
          <button 
            onClick={fetchLayout}
            className="bg-logic-green text-black px-4 py-2 rounded-lg hover:bg-logic-green/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const NavBar = () => (
    <nav className="relative z-20 flex items-center justify-between px-8 py-6 lg:px-12">
      <div className="flex items-center">
        <Link href="/" className="group">
          <span className="text-3xl font-bold text-logic-green tracking-wide hover:scale-105 transition-transform">
            l0gik
          </span>
        </Link>
      </div>
    </nav>
  );

  if (layoutNumber === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
        <div className="absolute left-0 top-0 w-px h-full bg-gray-600 opacity-20"></div>
        <div className="absolute right-0 top-0 w-px h-full bg-gray-600 opacity-20"></div>
        
        <NavBar />

        <div className="relative z-10 min-h-[calc(100vh-100px)] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-12">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-3 space-y-6 text-center lg:text-left order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -top-32 -left-32 w-64 h-64 bg-logic-green opacity-5 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-green-400 opacity-5 rounded-full blur-2xl"></div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    <span className="text-white block">Gerando e</span>
                    <span className="text-white block">Centralizando</span>
                    <span className="text-logic-green block">Análises e</span>
                    <span className="text-logic-green block">Otimizando Custos!</span>
                  </h1>
                  
                  <p className="mt-6 text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Descubra novas oportunidades para desenvolver seus resultados com nosso time.
                  </p>
                  
                  <div className="mt-6 flex items-center justify-center lg:justify-start space-x-2">
                    <span className="text-logic-green font-bold text-lg">L0gik</span> 
                    <span className="text-gray-400">-</span>
                    <span className="text-gray-300 font-medium">Make Data Happen</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-gray-700/30 shadow-2xl max-w-lg mx-auto lg:mx-0">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-logic-green/10 rounded-full mb-3">
                      <svg className="w-6 h-6 text-logic-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      Entre em Contato
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Preencha o formulário e nossa equipe entrará em contato em breve.
                    </p>
                  </div>
                  
                  <ContactForm />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layoutNumber === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-gray-900 to-black text-white">
        <NavBar />
        
        <div className="relative py-20 px-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-logic-green/10"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-blue-300">Transforme seus</span>
              <br />
              <span className="text-logic-green">Dados em Resultados</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Potencialize sua empresa com análises inteligentes e soluções personalizadas para seu negócio.
            </p>
            <div className="flex items-center justify-center space-x-3">
             
            </div>
          </div>
        </div>

        <div className="py-16 px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/90 to-blue-900/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-700/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-logic-green/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-logic-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Vamos Conversar?
                </h2>
                <p className="text-blue-200">
                  Compartilhe seus desafios e descubra como podemos ajudar sua empresa a crescer.
                </p>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layoutNumber === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-900 via-gray-900 to-gray-800 text-white">
        <NavBar />
        
        <div className="min-h-[calc(100vh-100px)] flex items-center px-8 lg:px-12">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-logic-green/20 rounded-full blur-2xl"></div>
                  <div className="relative z-10">

                    
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                      <span className="text-white">Dados que</span>
                      <br />
                      <span className="text-logic-green">Movimentam</span>
                      <br />
                      <span className="text-white">Negócios</span>
                    </h1>
                    
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                      Conectamos tecnologia e estratégia para transformar informações em vantagem competitiva para sua empresa.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-logic-green/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-logic-green rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Análises avançadas de dados</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-logic-green/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-logic-green rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Otimização de custos e processos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-logic-green/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-logic-green rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Soluções personalizadas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>
                <div className="relative z-10 bg-gradient-to-br from-gray-800/90 to-green-900/50 backdrop-blur-xl rounded-3xl p-8 border border-green-700/30 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-logic-green/15 rounded-full mb-4">
                      <svg className="w-7 h-7 text-logic-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Fale Conosco
                    </h2>
                    <p className="text-green-200 text-sm">
                      Conte-nos sobre seu projeto e vamos encontrar a melhor solução juntos.
                    </p>
                  </div>
                  
                  <ContactForm />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">Layout não encontrado: {layoutNumber}</p>
        <button 
          onClick={fetchLayout}
          className="bg-logic-green text-black px-4 py-2 rounded-lg hover:bg-logic-green/90"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}