import { useEffect, useRef } from 'react';

const HeatmapCanvas = ({ clicks }) => {
  const containerRef = useRef(null);

  // Calculate click density for opacity
  const getOpacity = (clickCount) => {
    const maxClicks = Math.max(...Object.values(clickCount));
    return (count) => Math.min(0.2 + (count / maxClicks) * 0.8, 1);
  };

  // Group nearby clicks
  const groupClicks = (clicks, radius = 30) => {
    const groups = {};
    clicks.forEach(click => {
      const key = `${Math.round(click.x / radius) * radius}-${Math.round(click.y / radius) * radius}`;
      groups[key] = (groups[key] || 0) + 1;
    });
    return groups;
  };

  const clickGroups = groupClicks(clicks);
  const getOpacityValue = getOpacity(clickGroups);

  if (!clicks || clicks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <p className="text-gray-500 dark:text-gray-400">No click data available for this page</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      style={{ width: '100%', height: '600px' }}
    >
      {/* Simulated webpage background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="p-8">
          <div className="h-16 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-4"></div>
          <div className="h-32 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-white dark:bg-gray-700 rounded-lg shadow-sm"></div>
            <div className="h-24 bg-white dark:bg-gray-700 rounded-lg shadow-sm"></div>
            <div className="h-24 bg-white dark:bg-gray-700 rounded-lg shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Click heatmap dots */}
      {Object.entries(clickGroups).map(([key, count]) => {
        const [x, y] = key.split('-').map(Number);
        const opacity = getOpacityValue(count);
        const size = 20 + (count * 2);

        return (
          <div
            key={key}
            className="absolute rounded-full bg-red-500 pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${size}px rgba(239, 68, 68, ${opacity})`,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping" style={{ opacity: 0.3 }} />
          </div>
        );
      })}

      {/* Click count badge */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{clicks.length}</p>
      </div>
    </div>
  );
};

export default HeatmapCanvas;
