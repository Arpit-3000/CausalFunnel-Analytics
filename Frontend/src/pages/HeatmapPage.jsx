import { useState, useEffect } from 'react';
import HeatmapCanvas from '../components/HeatmapCanvas';
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Click Heatmap</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visualize user click patterns</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {/* URL Selector */}
        <div className="card p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Page URL
          </label>
          <select
            value={selectedUrl}
            onChange={handleUrlChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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

        {/* Heatmap */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Click Visualization</h2>
            {loading && (
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
            )}
          </div>
          
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ) : (
            <HeatmapCanvas clicks={heatmapData} />
          )}

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legend</h3>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-300"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Low clicks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium clicks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-700"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High clicks</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeatmapPage;
