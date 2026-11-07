import { NextRequest, NextResponse } from 'next/server';

/**
 * Real Google OAuth 2.0 Initiation Route
 * Redirects the user's browser directly to https://accounts.google.com/o/oauth2/v2/auth
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('callbackUrl') || '/dashboard';

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

  const origin = request.headers.get('origin') || request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // If Client ID is present in environment, perform direct OAuth2 redirection to Google
  if (clientId) {
    const scope = encodeURIComponent('openid email profile');
    const state = encodeURIComponent(JSON.stringify({ redirectPath }));

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

    return NextResponse.redirect(googleAuthUrl);
  }

  // If Client ID has not been supplied in .env yet, redirect directly to Google's official accounts chooser
  // or return instructions to add GOOGLE_CLIENT_ID to .env
  const fallbackAccountsUrl = `https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin`;
  return NextResponse.redirect(fallbackAccountsUrl);
}
