import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  console.log('Webhook received - Headers:', Object.fromEntries(req.headers.entries()));
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('Webhook - svix_id:', svix_id);
  console.log('Webhook - svix_timestamp:', svix_timestamp);
  console.log('Webhook - svix_signature:', svix_signature);

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log('Webhook - Missing svix headers, returning 400');
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  console.log('Webhook - Payload received:', payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, public_metadata } = evt.data;
    
    console.log('User created webhook:', id, public_metadata);
    
    // Check if user was created with a referral code
    // This would be passed from the frontend during sign-up
    console.log('User created:', id, public_metadata);
    
    // You can add additional logic here to process the referral
    // For example, notify the referrer, update analytics, etc.
  }

  return new Response('', { status: 200 });
}
