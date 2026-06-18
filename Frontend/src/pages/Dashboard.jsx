import { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';
import SearchFilter from '../components/SearchFilter';
import EventTrendChart from '../components/charts/EventTrendChart';
import EventDistributionChart from '../components/charts/EventDistributionChart';
import SessionTrendChart from '../components/charts/SessionTrendChart';
import { analyticsAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chart data states
  const [eventsTrend, setEventsTrend] = useState([]);
  const [eventDistribution, setEventDistribution] = useState(null);
  const [sessionTrend, setSessionTrend] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchChartData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, sessionsResponse] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getSessions()
      ]);

      setStats(statsResponse.data);
      setSessions(sessionsResponse.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setChartsLoading(true);
      
      const [trendResponse, distributionResponse, sessionTrendResponse] = await Promise.all([
        analyticsAPI.getEventsTrend(7),
        analyticsAPI.getEventDistribution(),
        analyticsAPI.getSessionTrend(7)
      ]);

      setEventsTrend(trendResponse.data);
      setEventDistribution(distributionResponse.data);
      setSessionTrend(sessionTrendResponse.data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setChartsLoading(false);
    }
  };

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    
    return sessions.filter(session => 
      session.sessionId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sessions, searchQuery]);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{getCurrentDate()}</p>
            </div>
            <button
              onClick={() => {
                fetchData();
                fetchChartData();
              }}
              className="btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              <span>{loading ? '⟳' : '↻'}</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats?.totalSessions}
            icon="▪"
            color="primary"
          />
          <StatCard
            title="Total Events"
            value={stats?.totalEvents}
            icon="▪"
            color="green"
          />
          <StatCard
            title="Total Clicks"
            value={stats?.totalClicks}
            icon="▪"
            color="purple"
          />
          <StatCard
            title="Page Views"
            value={stats?.totalPageViews}
            icon="▪"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Trends</h2>
          
          {/* Event Trend Chart - Full Width */}
          <div className="mb-6">
            <EventTrendChart data={eventsTrend} loading={chartsLoading} />
          </div>

          {/* Distribution and Session Charts - Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EventDistributionChart data={eventDistribution} loading={chartsLoading} />
            <SessionTrendChart data={sessionTrend} loading={chartsLoading} />
          </div>
        </div>

        {/* Sessions Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Sessions</h2>
          
          {/* Search Filter */}
          <SearchFilter
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search Session ID..."
          />

          {/* Sessions Table */}
          {filteredSessions.length === 0 && searchQuery ? (
            <div className="card p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No matching sessions found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search query</p>
            </div>
          ) : (
            <SessionTable sessions={filteredSessions} loading={loading} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
