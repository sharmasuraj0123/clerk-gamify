'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function ReferralHandler() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');

  useEffect(() => {
    const storeReferralCode = async () => {
      if (isLoaded && user && refCode) {
        try {
          const response = await fetch('/api/referral', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refCode }),
          });

          if (response.ok) {
            console.log('Referral code stored successfully');
          } else {
            console.error('Failed to store referral code');
          }
        } catch (error) {
          console.error('Error storing referral code:', error);
        }
      }
    };

    storeReferralCode();
  }, [isLoaded, user, refCode]);

  return null; // This component doesn't render anything
}
