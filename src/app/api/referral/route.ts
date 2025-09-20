import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    console.log('POST /api/referral - userId:', userId);
    
    if (!userId) {
      console.log('POST /api/referral - No userId, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { refCode } = await request.json();
    console.log('POST /api/referral - refCode:', refCode);

    if (!refCode) {
      console.log('POST /api/referral - No refCode provided');
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    console.log('POST /api/referral - Attempting to update user metadata for userId:', userId);

    // Store referral code in user's public metadata
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          referralCode: refCode,
          referredAt: new Date().toISOString(),
        }
      }),
    });

    console.log('POST /api/referral - Clerk API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('POST /api/referral - Clerk API error:', errorText);
      throw new Error(`Failed to update user metadata: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('POST /api/referral - Success, updated metadata:', result.public_metadata);

    return NextResponse.json({ 
      success: true, 
      message: 'Referral code stored successfully' 
    });

  } catch (error) {
    console.error('Error storing referral code:', error);
    return NextResponse.json(
      { error: 'Failed to store referral code' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    console.log('GET /api/referral - userId:', userId);
    
    if (!userId) {
      console.log('GET /api/referral - No userId, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's referral information
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    console.log('GET /api/referral - Clerk API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GET /api/referral - Clerk API error:', errorText);
      throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
    }

    const user = await response.json();
    console.log('GET /api/referral - User data:', user);
    console.log('GET /api/referral - Public metadata:', user.public_metadata);
    
    const referralCode = user.public_metadata?.referralCode || null;
    const referredAt = user.public_metadata?.referredAt || null;

    console.log('GET /api/referral - Extracted referralCode:', referralCode);
    console.log('GET /api/referral - Extracted referredAt:', referredAt);

    return NextResponse.json({ 
      referralCode,
      referredAt,
      hasReferralCode: !!referralCode
    });

  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' }, 
      { status: 500 }
    );
  }
}
