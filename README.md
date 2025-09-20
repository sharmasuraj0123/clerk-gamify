# Next.js App with Clerk Authentication

A modern Next.js application with Clerk authentication integration, featuring protected routes, user management, and a beautiful UI.

## Features

- 🔐 **Authentication**: Secure sign-in and sign-up with Clerk
- 🛡️ **Route Protection**: Middleware-based route protection
- 👤 **User Management**: Built-in user profile and session handling
- 🎯 **Referral System**: Complete referral program with code tracking
- ⚡ **Easy Integration**: Pre-built components and hooks
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Clerk** - Authentication and user management
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Clerk account (free at [clerk.com](https://clerk.com))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-clerkfrontend
npm install
```

### 2. Set up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your API keys from the dashboard
4. Update the `.env.local` file with your keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── sign-in/           # Sign-in page
│   ├── sign-up/           # Sign-up page
│   ├── layout.tsx         # Root layout with ClerkProvider
│   └── page.tsx           # Home page
├── middleware.ts           # Route protection middleware
└── ...
```

## Key Components

### Authentication Pages
- `/sign-in` - User sign-in page
- `/sign-up` - User registration page
- `/dashboard` - Protected dashboard (requires authentication)

### Middleware
The `middleware.ts` file protects routes and handles authentication state.

### Environment Variables
Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Usage

### Referral System
The app includes a complete referral system:

1. **Referral Registration**: Users can register with `/register?ref=refcode`
2. **Referral Code Storage**: Codes are stored in user's Clerk public metadata
3. **Referral Link Generation**: Each user gets a unique referral link
4. **Dashboard Management**: Users can view and manage their referral status

#### How it works:
- Users get a unique referral code based on their user ID
- They can share their referral link: `yoursite.com/register?ref=REF12345678`
- When someone registers with their code, it's stored in the new user's metadata
- Both users can track referral status in their dashboard

### Protecting Routes
Routes are automatically protected by the middleware. Add routes to the `publicRoutes` array in `middleware.ts` to make them accessible without authentication.

### Using User Data
```tsx
import { currentUser } from '@clerk/nextjs';

export default async function Page() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return <div>Welcome, {user.firstName}!</div>;
}
```

### Client-side Authentication
```tsx
import { useUser } from '@clerk/nextjs';

export default function Component() {
  const { isSignedIn, user } = useUser();
  
  if (!isSignedIn) return <div>Please sign in</div>;
  
  return <div>Hello {user.firstName}!</div>;
}
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Clerk environment variables in Vercel's dashboard
4. Deploy!

### Other Platforms
Make sure to set the environment variables in your deployment platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT License - feel free to use this project as a starting point for your own applications!