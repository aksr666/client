import React from 'react';

import Layout from '../components/layout/Layout';

const AppPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Room</h3>
        <p className="text-gray-600">
          Choose a room from the sidebar to start collaborating with others.
        </p>
      </div>
    </Layout>
  );
};

export default AppPage;
