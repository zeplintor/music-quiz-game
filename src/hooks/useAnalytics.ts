
import { useGA4 } from './useGA4';

export const useAnalytics = () => {
  const ga4 = useGA4();

  return {
    // Page tracking
    trackPageView: ga4.trackPageView,
    
    // Grid interactions
    trackBlockClick: ga4.trackBlockClick,
    trackBlockShare: ga4.trackBlockShare,
    
    // Audio interactions
    trackAudioPlay: ga4.trackAudioPlay,
    trackAudioPause: ga4.trackAudioPause,
    
    // Conversion funnel
    trackReservationStart: ga4.trackReservationStart,
    trackReservationComplete: ga4.trackReservationComplete,
    
    // Custom events
    trackEvent: ga4.trackEvent
  };
};
