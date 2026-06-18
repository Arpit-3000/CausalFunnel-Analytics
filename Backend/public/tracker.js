(function() {
  'use strict';

  const API_ENDPOINT = 'http://localhost:5000/api/events';
  const SESSION_KEY = 'analytics_session_id';
  const RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000;

  // Generate unique session ID
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session ID
  function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  // Send event to backend with retry logic
  async function sendEvent(eventData, retries = RETRY_ATTEMPTS) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Event tracked:', data);
      return data;
    } catch (error) {
      console.error('Error sending event:', error);
      
      if (retries > 0) {
        console.log(`Retrying... (${RETRY_ATTEMPTS - retries + 1}/${RETRY_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return sendEvent(eventData, retries - 1);
      } else {
        console.error('Failed to send event after multiple attempts');
      }
    }
  }

  // Track page view
  function trackPageView() {
    const sessionId = getSessionId();
    const eventData = {
      sessionId,
      eventType: 'page_view',
      pageUrl: window.location.pathname,
      timestamp: new Date().toISOString()
    };
    
    sendEvent(eventData);
  }

  // Track click
  function trackClick(event) {
    const sessionId = getSessionId();
    const eventData = {
      sessionId,
      eventType: 'click',
      pageUrl: window.location.pathname,
      timestamp: new Date().toISOString(),
      clickX: event.clientX,
      clickY: event.clientY
    };
    
    sendEvent(eventData);
  }

  // Initialize tracking
  function init() {
    console.log('Analytics tracker initialized');
    
    // Track initial page view
    trackPageView();

    // Track clicks
    document.addEventListener('click', trackClick);

    // Track page views on history changes
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      window.history.pushState = function() {
        originalPushState.apply(window.history, arguments);
        trackPageView();
      };
    }

    // Track page views on popstate
    window.addEventListener('popstate', trackPageView);
  }

  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
