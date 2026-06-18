import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JourneyTimeline from '../components/JourneyTimeline';
import EventTypeFilter from '../components/EventTypeFilter';
import { analyticsAPI } from '../services/api';

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getSessionById(id);
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching session details:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === 'all') return events;
    return events.filter(event => event.eventType === eventTypeFilter);
  }, [events, eventTypeFilter]);

  const getEventCounts = () => {
    if (!events || events.length === 0) return { all: 0, pageViews: 0, clicks: 0 };
    
    return {
      all: events.length,
      pageViews: events.filter(e => e.eventType === 'page_view').length,
      clicks: events.filter(e => e.eventType === 'click').length,
    };
  };

  const getSessionStats = () => {
    if (!events || events.length === 0) return null;
    
    return {
      totalEvents: events.length,
      clicks: events.filter(e => e.eventType === 'click').length,
      pageViews: events.filter(e => e.eventType === 'page_view').length,
      duration: new Date(events[events.length - 1].timestamp) - new Date(events[0].timestamp),
      uniquePages: new Set(events.map(e => e.pageUrl)).size
    };
  };

  const stats = getSessionStats();
  const counts = getEventCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session Journey</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-mono">{id}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="card p-12">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Session Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clicks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.clicks}</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pageViews}</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unique Pages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniquePages}</p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(stats.duration / 1000)}s
                  </p>
                </div>
              </div>
            )}

            {/* Timeline with Filter */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Journey Timeline</h2>
              
              {/* Event Type Filter */}
              <EventTypeFilter
                value={eventTypeFilter}
                onChange={setEventTypeFilter}
                counts={counts}
              />

              {/* Timeline */}
              <JourneyTimeline events={filteredEvents} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SessionDetails;
