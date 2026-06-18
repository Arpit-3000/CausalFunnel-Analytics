const StatCard = ({ title, value, icon, color = 'primary', trend }) => {
  const trendColor = trend?.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value?.toLocaleString() || 0}
        </p>
        {trend && (
          <p className={`text-xs font-medium ${trendColor} flex items-center`}>
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d={trend.startsWith('+') ? "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" : "M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"} clipRule="evenodd" />
            </svg>
            {trend} vs last week
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
