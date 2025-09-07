import React from 'react';

// Spinner Icon
const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Checkmark Icon
const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// X Icon
const XIcon = () => (
    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const StatusItem = ({ name, status }) => {
  let icon;
  let text;
  let textColor = 'text-gray-700';

  switch (status) {
    case 'waking':
      icon = <SpinnerIcon />;
      text = 'Waking up...';
      break;
    case 'ready':
      icon = <CheckIcon />;
      text = 'Ready!';
      textColor = 'text-green-600';
      break;
    case 'failed':
      icon = <XIcon />;
      text = 'Failed to start';
      textColor = 'text-red-600';
      break;
    default:
      return null;
  }

  return (
    <li className="flex items-center justify-between">
      <span className="text-gray-800">{name}</span>
      <div className={`flex items-center gap-2 ${textColor}`}>
        {icon}
        <span>{text}</span>
      </div>
    </li>
  );
};

export default function ServerStatusSidebar({ serverStatuses }) {
  if (Object.keys(serverStatuses).length === 0) {
    return null;
  }
  
  const allDone = Object.values(serverStatuses).every(s => s === 'ready' || s === 'failed');

  return (
    // --- YEH LINE BADAL DI HAI ---
    // Ab 'right-4' isey hamesha right side mein rakhega
    <div className={`fixed bottom-4 right-4 w-72 bg-white border rounded-lg shadow-xl p-4 transition-opacity duration-500 ${allDone ? 'opacity-0' : 'opacity-100'}`}>
      <h3 className="text-lg font-semibold border-b pb-2 mb-2 text-gray-900">Server Status</h3>
      <ul className="space-y-2">
        {Object.entries(serverStatuses).map(([name, status]) => (
          <StatusItem key={name} name={name} status={status} />
        ))}
      </ul>
    </div>
  );
}

