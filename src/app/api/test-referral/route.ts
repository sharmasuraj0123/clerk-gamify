import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { refCode, userId } = await req.json();
    
    console.log('Test referral API - refCode:', refCode);
    console.log('Test referral API - userId:', userId);
    
    // Simulate storing referral code
    const mockResult = {
      success: true,
      message: 'Referral code would be stored',
      refCode,
      userId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Test referral API - Result:', mockResult);
    
    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Test referral API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process test referral' 
    }, { status: 500 });
  }
}
