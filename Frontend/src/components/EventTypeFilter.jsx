const EventTypeFilter = ({ value, onChange, counts }) => {
  const options = [
    { value: 'all', label: 'All Events', count: counts?.all || 0 },
    { value: 'page_view', label: 'Page Views', count: counts?.pageViews || 0 },
    { value: 'click', label: 'Click Events', count: counts?.clicks || 0 },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Filter by Event Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventTypeFilter;
