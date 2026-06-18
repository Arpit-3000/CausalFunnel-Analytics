import { useState, useEffect } from 'react';
import HeatmapCanvas from '../components/HeatmapCanvas';
import ThemeToggle from '../components/ThemeToggle';
import { analyticsAPI } from '../services/api';

const HeatmapPage = () => {
  const [pageUrls, setPageUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPageUrls();
  }, []);

  const fetchPageUrls = async () => {
    try {
      const response = await analyticsAPI.getPageUrls();
      setPageUrls(response.data);
      if (response.data.length > 0) {
        setSelectedUrl(response.data[0]);
        fetchHeatmapData(response.data[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching page URLs:', err);
    }
  };

  const fetchHeatmapData = async (url) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getHeatmap(url);
      setHeatmapData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching heatmap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setSelectedUrl(url);
    fetchHeatmapData(url);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalClicks = heatmapData.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Heatmap</h1>
            
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

        {/* Controls */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page URL
              </label>
              <select
                value={selectedUrl}
                onChange={handleUrlChange}
                className="w-80 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {pageUrls.length === 0 ? (
                  <option>No pages available</option>
                ) : (
                  pageUrls.map((url) => (
                    <option key={url} value={url}>
                      {url}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Last 7 days</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Heatmap Visualization */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              {/* Browser Mock */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">https://causalfunnel.com{selectedUrl}</span>
                </div>
              </div>

              {loading ? (
                <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : (
                <HeatmapCanvas clicks={heatmapData} />
              )}
            </div>
          </div>

          {/* Right Sidebar Stats */}
          <div className="space-y-6">
            {/* Total Clicks */}
            <div className="card p-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Total Clicks
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {totalClicks.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +9.3%
              </p>
            </div>

            {/* Most Clicked */}
            <div className="card p-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Most Clicked
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Get Started
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                847 clicks · Center-top
              </p>
            </div>

            {/* Click Zones */}
            <div className="card p-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Click Zones
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Top 33%</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">62%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '62%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mid 33%</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">28%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Bottom 33%</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">10%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avg Click Position */}
            <div className="card p-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Avg Click Position
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                X: 48% · Y: 34%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upper-center region
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeatmapPage;
