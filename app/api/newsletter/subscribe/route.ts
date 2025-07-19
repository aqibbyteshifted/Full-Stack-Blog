import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Validate the email address
    // 2. Save to your database
    // 3. Optionally, add to an email marketing service
    
    console.log('New subscription:', email);
    
    // For now, we'll just return a success response
    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
