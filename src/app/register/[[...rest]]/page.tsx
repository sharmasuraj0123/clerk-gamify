'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {refCode ? 'Join with Referral' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {refCode ? (
              <>
                You&apos;ve been invited by a friend! Use referral code: <span className="font-semibold text-blue-600">{refCode}</span>
              </>
            ) : (
              'Get started with our platform today.'
            )}
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            routing="hash"
            afterSignUpUrl={refCode ? `/dashboard?ref=${refCode}` : '/dashboard'}
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              }
            }}
          />
        </div>
        {refCode && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              🎉 You&apos;ll get special benefits when you complete your registration with this referral code!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
