'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const { user, isLoaded } = useUser();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/referral');
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchReferralData();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view debug information</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddresses: user.emailAddresses,
                publicMetadata: user.publicMetadata,
                createdAt: user.createdAt,
              }, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Referral Data from API</h2>
            <button 
              onClick={fetchReferralData}
              disabled={loading}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Refresh Referral Data'}
            </button>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(referralData, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">URL Parameters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                href: typeof window !== 'undefined' ? window.location.href : 'N/A',
                search: typeof window !== 'undefined' ? window.location.search : 'N/A',
                ref: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') : 'N/A',
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
