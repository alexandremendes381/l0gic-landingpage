'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { pushDataLayer } from '@/lib/gtmConfig';

function PageViewTracker() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.toString();
    const fullPath = pathname + (query ? `?${query}` : '');

    pushDataLayer({
      event: 'page_view',
      page_location: window.location.href,
      page_path: fullPath,
      page_title: document.title,
      page_referrer: document.referrer || '',
      page_language: navigator.language,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      engagement_type: isFirstLoad.current ? 'landing' : 'navigation'
    });

    isFirstLoad.current = false;
  }, [pathname]);

  return null;
}

export function UsePageView() {
  return <PageViewTracker />;
}