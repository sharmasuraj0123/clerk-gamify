import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Header with Auth */}
      <header className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
          <span className="text-lg font-semibold">+ Clerk Auth</span>
        </div>
        <div className="flex items-center space-x-4">
          {userId ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Next.js + Clerk
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern authentication solution for your Next.js applications
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">🔐 Authentication</h3>
              <p className="text-gray-600 text-sm">
                Secure sign-in and sign-up with email, social providers, and more.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">🛡️ Route Protection</h3>
              <p className="text-gray-600 text-sm">
                Protect your pages and API routes with middleware.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">👤 User Management</h3>
              <p className="text-gray-600 text-sm">
                Built-in user profile management and session handling.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">🎯 Referral System</h3>
              <p className="text-gray-600 text-sm">
                Complete referral program with code tracking and rewards.
              </p>
            </div>
          </div>
        </div>

        {!userId && (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <SignUpButton mode="modal">
              <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://clerk.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Clerk Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Next.js Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/clerkinc/clerk-nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          GitHub →
        </a>
      </footer>
    </div>
  );
}
