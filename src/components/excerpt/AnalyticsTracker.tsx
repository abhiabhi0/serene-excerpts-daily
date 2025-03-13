
interface TrackingParams {
  eventName: string;
  params: Record<string, any>;
}

export const useAnalyticsTracker = () => {
  const trackEvent = ({ eventName, params }: TrackingParams) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
        console.log(`${eventName} event sent to GA`);
      }
    } catch (error) {
      console.error('GA tracking error:', error);
    }
  };

  return { trackEvent };
};
