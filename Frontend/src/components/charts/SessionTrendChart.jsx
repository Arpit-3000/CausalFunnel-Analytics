import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SessionTrendChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Session Trend</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sessions vs. bounced — this week</p>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No analytics data available
        </div>
      </div>
    );
  }

  // Transform data for the chart with day names
  const transformedData = data.map(item => ({
    ...item,
    dayName: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Session Trend</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sessions vs. bounced — this week</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="dayName" 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="sessions" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionTrendChart;
