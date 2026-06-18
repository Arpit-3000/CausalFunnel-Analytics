import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EventDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!data || (data.clicks === 0 && data.pageViews === 0)) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Event Distribution</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Breakdown by event type</p>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No analytics data available
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Page View', value: data.pageViews, color: '#3b82f6' },
    { name: 'Click', value: data.clicks, color: '#10b981' }
  ];

  const COLORS = ['#3b82f6', '#10b981'];
  const total = data.clicks + data.pageViews;

  const CustomLegend = () => (
    <div className="mt-6 space-y-2">
      {chartData.map((entry, index) => {
        const percentage = ((entry.value / total) * 100).toFixed(0);
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Event Distribution</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Breakdown by event type</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
};

export default EventDistributionChart;
