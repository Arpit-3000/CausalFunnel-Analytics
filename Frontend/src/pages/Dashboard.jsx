import { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';
import SearchFilter from '../components/SearchFilter';
import EventTrendChart from '../components/charts/EventTrendChart';
import EventDistributionChart from '../components/charts/EventDistributionChart';
import SessionTrendChart from '../components/charts/SessionTrendChart';
import ThemeToggle from '../components/ThemeToggle';
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics Overview</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{getCurrentDate()}</span>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <ThemeToggle />
              
              <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
                AK
              </button>
            </div>
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
            color="primary"
            trend="+12.4%"
          />
          <StatCard
            title="Total Events"
            value={stats?.totalEvents}
            color="green"
            trend="+8.7%"
          />
          <StatCard
            title="Total Clicks"
            value={stats?.totalClicks}
            color="purple"
            trend="-2.1%"
          />
          <StatCard
            title="Page Views"
            value={stats?.totalPageViews}
            color="orange"
            trend="+16.3%"
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
        <div className="card p-6">
          {/* Header with tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
              <div className="flex items-center space-x-3">
                {/* Search Filter */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search session ID..."
                    className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Bounced</option>
                </select>
                
                <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Jun 18, 2026</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          {filteredSessions.length === 0 && searchQuery ? (
            <div className="py-12 text-center">
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
