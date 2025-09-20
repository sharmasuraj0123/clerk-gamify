import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ReferralSection from './components/ReferralSection';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome to your dashboard!
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard!
              </h2>
              <p className="text-gray-600 mb-6">
                This is a protected route. Only authenticated users can see this content.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    User Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>User ID:</strong> {userId}</p>
                    <p><strong>Status:</strong> Authenticated</p>
                    <p><strong>Access Level:</strong> Protected Route</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Referral Program
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Earn rewards</strong> by referring friends</p>
                    <p><strong>Share your link</strong> and get benefits</p>
                    <p><strong>Track referrals</strong> in real-time</p>
                  </div>
                </div>
              </div>
              
              <ReferralSection userId={userId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
