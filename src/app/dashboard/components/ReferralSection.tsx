'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface ReferralData {
  referralCode: string | null;
  referredAt: string | null;
  hasReferralCode: boolean;
}

interface ReferralSectionProps {
  userId: string;
}

export default function ReferralSection({ userId }: ReferralSectionProps) {
  const { user, isLoaded } = useUser();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Generate a referral code based on user ID
  const generateReferralCode = (userId: string) => {
    return `REF${userId.slice(-8).toUpperCase()}`;
  };

  const userReferralCode = generateReferralCode(userId);
  const [referralLink, setReferralLink] = useState('');

  const handleUrlReferralCode = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!isLoaded || !user) {
      console.log('handleUrlReferralCode - User not loaded yet, retrying...');
      if (retryCount < 5) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000);
      }
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlRefCode = urlParams.get('ref');
    
    console.log('handleUrlReferralCode - urlRefCode:', urlRefCode);
    console.log('handleUrlReferralCode - referralData?.hasReferralCode:', referralData?.hasReferralCode);
    console.log('handleUrlReferralCode - user.isLoaded:', isLoaded);
    console.log('handleUrlReferralCode - user.id:', user?.id);
    
    if (urlRefCode && !referralData?.hasReferralCode) {
      console.log('handleUrlReferralCode - Attempting to store referral code:', urlRefCode);
      try {
        const response = await fetch('/api/referral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refCode: urlRefCode }),
        });

        console.log('handleUrlReferralCode - API response status:', response.status);
        
        if (response.ok) {
          console.log('handleUrlReferralCode - Success, fetching updated data');
          await fetchReferralData();
          // Remove the ref parameter from URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('ref');
          window.history.replaceState({}, '', newUrl.toString());
        } else {
          const errorData = await response.json();
          console.error('handleUrlReferralCode - API error:', errorData);
        }
      } catch (error) {
        console.error('Error storing referral code from URL:', error);
      }
    }
  }, [referralData?.hasReferralCode, isLoaded, user, retryCount]);

  useEffect(() => {
    // Set referral link on client side
    if (typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}/register?ref=${userReferralCode}`);
    }
    fetchReferralData();
  }, [userReferralCode]);

  useEffect(() => {
    // Handle referral code when user is loaded
    if (isLoaded && user) {
      handleUrlReferralCode();
    }
  }, [isLoaded, user, handleUrlReferralCode]);

  const fetchReferralData = async () => {
    try {
      console.log('fetchReferralData - Fetching referral data...');
      const response = await fetch('/api/referral');
      console.log('fetchReferralData - Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('fetchReferralData - Data received:', data);
        setReferralData(data);
      } else {
        const errorData = await response.json();
        console.error('fetchReferralData - API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreReferralCode = async () => {
    if (!refCode.trim()) return;

    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refCode: refCode.trim() }),
      });

      if (response.ok) {
        await fetchReferralData();
        setRefCode('');
        alert('Referral code stored successfully!');
      } else {
        alert('Failed to store referral code');
      }
    } catch (error) {
      console.error('Error storing referral code:', error);
      alert('Error storing referral code');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Your Referral Link */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Your Referral Link
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Share this link with friends to earn referral rewards!
          </p>
        </div>
      </div>

      {/* Referral Code Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Enter Referral Code
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              placeholder="Enter referral code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleStoreReferralCode}
              disabled={!refCode.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Store Code
            </button>
          </div>
          <p className="text-sm text-gray-600">
            If someone referred you, enter their referral code here.
          </p>
        </div>
      </div>

      {/* Referral Status */}
      {referralData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Referral Status
          </h3>
          <div className="space-y-2">
            {referralData.hasReferralCode ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ You were referred by: <strong>{referralData.referralCode}</strong>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Referred on: {new Date(referralData.referredAt!).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-600">
                  No referral code found. Enter a code above if someone referred you.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Section */}
      <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
        <h3 className="text-lg font-medium text-yellow-900 mb-4">
          Debug Information
        </h3>
        <div className="space-y-2 text-sm">
          <p><strong>User Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          <p><strong>Retry Count:</strong> {retryCount}</p>
          <p><strong>URL Ref Code:</strong> {typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') || 'None' : 'N/A'}</p>
          <p><strong>Current Referral Data:</strong> {referralData ? JSON.stringify(referralData) : 'Loading...'}</p>
        </div>
        <div className="mt-4 space-x-2">
          <button
            onClick={handleUrlReferralCode}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
          >
            Force Process Referral Code
          </button>
          <button
            onClick={fetchReferralData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh Referral Data
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Referral Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-blue-800">Total Referrals</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-green-800">Successful Signups</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$0</div>
            <div className="text-sm text-purple-800">Earned Rewards</div>
          </div>
        </div>
      </div>
    </div>
  );
}
