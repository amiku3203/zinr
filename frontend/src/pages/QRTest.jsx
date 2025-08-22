import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QRTest = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [testUrl, setTestUrl] = useState('');

  const testUrls = [
    `/menu/${restaurantId}`,
    `http://localhost:5173/menu/${restaurantId}`,
    `http://localhost:3000/menu/${restaurantId}`,
    `https://yourdomain.com/menu/${restaurantId}`,
  ];

  const handleTestUrl = (url) => {
    setTestUrl(url);
    console.log('Testing URL:', url);
    
    // Try to navigate to the URL
    try {
      navigate(url);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleManualTest = () => {
    if (testUrl) {
      console.log('Testing manual URL:', testUrl);
      window.open(testUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">QR Code Link Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Restaurant ID</h2>
          <p className="text-gray-600 font-mono bg-gray-100 p-3 rounded">
            {restaurantId || 'No restaurant ID provided'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test URLs</h2>
          <div className="space-y-3">
            {testUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-3">
                <button
                  onClick={() => handleTestUrl(url)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test
                </button>
                <span className="font-mono text-sm bg-gray-100 p-2 rounded flex-1">
                  {url}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual URL Test</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Enter URL to test"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualTest}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test URL
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• QR code should generate a URL like: <code className="bg-gray-100 px-2 py-1 rounded">/menu/{restaurantId}</code></li>
            <li>• When scanned, it should open the customer order page</li>
            <li>• The page should display the restaurant's menu and allow ordering</li>
            <li>• If restaurant doesn't exist, show "Restaurant Not Found" message</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRTest;
