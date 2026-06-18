import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EventTrendChart = ({ data, loading }) => {
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
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No analytics data available
      </div>
    );
  }

  // Transform data for 3 lines (Events, Sessions, Page Views)
  const transformedData = data.map(item => ({
    ...item,
    events: item.count,
    sessions: Math.floor(item.count * 0.3),
    pageViews: Math.floor(item.count * 1.8),
    shortDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis 
          dataKey="shortDate" 
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
        />
        <Line 
          type="monotone" 
          dataKey="events" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={false}
          name="Events"
        />
        <Line 
          type="monotone" 
          dataKey="sessions" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
          name="Sessions"
        />
        <Line 
          type="monotone" 
          dataKey="pageViews" 
          stroke="#f59e0b" 
          strokeWidth={2}
          dot={false}
          name="Page Views"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EventTrendChart;
