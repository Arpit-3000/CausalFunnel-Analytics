const JourneyTimeline = ({ events }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventIcon = (eventType) => {
    return eventType === 'page_view' ? '○' : '●';
  };

  const getEventColor = (eventType) => {
    return eventType === 'page_view' ? 'bg-blue-500 dark:bg-blue-600' : 'bg-green-500 dark:bg-green-600';
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No events in this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={event._id} className="relative flex items-start">
          {/* Timeline line */}
          {index !== events.length - 1 && (
            <div className="absolute left-4 top-10 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
          )}

          {/* Event marker */}
          <div className={`relative z-10 w-8 h-8 rounded-full ${getEventColor(event.eventType)} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-sm">{getEventIcon(event.eventType)}</span>
          </div>

          {/* Event details */}
          <div className="ml-4 flex-1">
            <div className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                  {event.eventType.replace('_', ' ')}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">URL:</span> {event.pageUrl}
              </p>
              {event.eventType === 'click' && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Position:</span> X: {event.clickX}, Y: {event.clickY}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JourneyTimeline;
