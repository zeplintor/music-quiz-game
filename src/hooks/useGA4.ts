
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    ga4MeasurementId?: string;
  }
}

interface GA4Settings {
  ga4_measurement_id: string;
  ga4_enabled: boolean;
}

export const useGA4 = () => {
  useEffect(() => {
    const initGA4 = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['ga4_measurement_id', 'ga4_enabled']);

        if (error) {
          console.error('Error loading GA4 settings:', error);
          return;
        }

        const settings = data.reduce((acc: GA4Settings, item) => {
          if (item.setting_key === 'ga4_enabled') {
            acc.ga4_enabled = item.setting_value === 'true';
          } else if (item.setting_key === 'ga4_measurement_id') {
            acc.ga4_measurement_id = item.setting_value || '';
          }
          return acc;
        }, { ga4_measurement_id: '', ga4_enabled: false });

        // Only load GA4 if enabled and measurement ID is provided
        if (!settings.ga4_enabled || !settings.ga4_measurement_id) {
          console.log('GA4 disabled or no measurement ID configured');
          return;
        }

        // Store the measurement ID globally for use in tracking functions
        window.ga4MeasurementId = settings.ga4_measurement_id;

        // Check if GA4 is already loaded
        if (window.gtag) {
          console.log('GA4 already loaded');
          return;
        }

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };

        // Configure GA4
        window.gtag('js', new Date());
        window.gtag('config', settings.ga4_measurement_id, {
          page_title: document.title,
          page_location: window.location.href
        });

        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga4_measurement_id}`;
        document.head.appendChild(script);

        console.log('GA4 initialized with ID:', settings.ga4_measurement_id);

      } catch (error) {
        console.error('Error initializing GA4:', error);
      }
    };

    initGA4();
  }, []);

  // Track page views
  const trackPageView = (page_title: string, page_location: string) => {
    if (window.gtag && window.ga4MeasurementId) {
      window.gtag('config', window.ga4MeasurementId, {
        page_title,
        page_location,
      });
    }
  };

  // Track custom events
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  // Specific tracking functions for our app
  const trackBlockClick = (x: number, y: number, hasAudio: boolean) => {
    trackEvent('block_click', {
      event_category: 'engagement',
      block_x: x,
      block_y: y,
      has_audio: hasAudio
    });
  };

  const trackAudioPlay = (x: number, y: number, duration: number) => {
    trackEvent('audio_play', {
      event_category: 'audio',
      block_x: x,
      block_y: y,
      audio_duration: duration
    });
  };

  const trackAudioPause = (x: number, y: number, playTime: number) => {
    trackEvent('audio_pause', {
      event_category: 'audio',
      block_x: x,
      block_y: y,
      play_time: playTime
    });
  };

  const trackReservationStart = (blocksCount: number) => {
    trackEvent('reservation_start', {
      event_category: 'conversion',
      blocks_count: blocksCount
    });
  };

  const trackReservationComplete = (blocksCount: number, totalAmount: number) => {
    trackEvent('purchase', {
      event_category: 'conversion',
      value: totalAmount,
      currency: 'EUR',
      items: [{
        item_id: 'block_reservation',
        item_name: 'Grid Block Reservation',
        quantity: blocksCount,
        price: totalAmount / blocksCount
      }]
    });
  };

  const trackBlockShare = (x: number, y: number) => {
    trackEvent('share', {
      event_category: 'social',
      content_type: 'block',
      item_id: `block_${x}_${y}`
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackBlockClick,
    trackAudioPlay,
    trackAudioPause,
    trackReservationStart,
    trackReservationComplete,
    trackBlockShare
  };
};
