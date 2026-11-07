import { NextRequest, NextResponse } from 'next/server';

/**
 * Real Google OAuth 2.0 Callback Route
 * Handles redirect back from Google OAuth with authorization code
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateStr = searchParams.get('state');

  let redirectPath = '/dashboard';
  if (stateStr) {
    try {
      const parsed = JSON.parse(decodeURIComponent(stateStr));
      if (parsed.redirectPath) redirectPath = parsed.redirectPath;
    } catch (e) {
      // ignore
    }
  }

  if (error || !code) {
    return NextResponse.redirect(new URL(`${redirectPath}?auth_error=${encodeURIComponent(error || 'cancelled')}`, request.url));
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = request.headers.get('origin') || request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    if (clientId && clientSecret) {
      // Exchange code for tokens at Google's token endpoint
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        // Fetch user profile from Google UserInfo API
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profile = await userRes.json();

        // Redirect to callback handler in frontend with real profile data in hash/query
        const successUrl = new URL(redirectPath, request.url);
        successUrl.searchParams.set('google_auth_success', 'true');
        successUrl.searchParams.set('email', profile.email || '');
        successUrl.searchParams.set('name', profile.name || '');
        successUrl.searchParams.set('picture', profile.picture || '');
        successUrl.searchParams.set('id', profile.id || '');
        return NextResponse.redirect(successUrl);
      }
    }

    // Direct return
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL(`${redirectPath}?auth_error=server_error`, request.url));
  }
}
