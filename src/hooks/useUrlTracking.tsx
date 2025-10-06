"use client";

import { useEffect, useState } from "react";

interface TrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  [key: string]: string | undefined;
}

export function useUrlTracking() {
  const [tracking, setTracking] = useState<TrackingData>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const urlData: TrackingData = {};
      
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
      
      trackingParams.forEach(param => {
        const value = params.get(param);
        if (value) {
          urlData[param] = value;
        }
      });

      if (Object.keys(urlData).length > 0) {
        const existing = JSON.parse(localStorage.getItem("trackingData") || "{}");
        const updated = { ...existing, ...urlData };
        localStorage.setItem("trackingData", JSON.stringify(updated));
        setTracking(updated);
        
        console.log('🎯 Novos parâmetros de tracking capturados:', urlData);
        console.log('📊 Dados de tracking atualizados:', updated);
      } else {
        const saved = JSON.parse(localStorage.getItem("trackingData") || "{}");
        setTracking(saved);
        
        if (Object.keys(saved).length > 0) {
          console.log('📋 Dados de tracking carregados do localStorage:', saved);
        } else {
          console.log('📄 Nenhum dado de tracking encontrado');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao capturar dados de tracking:', error);
    }
  }, []);

  return tracking;
}