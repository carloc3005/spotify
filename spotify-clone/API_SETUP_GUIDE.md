# API Setup Guide

## OAuth Issues - "Only good for one device?"

**Answer: No!** OAuth applications can work on multiple devices. The issue is with redirect URI configuration.

## 🔧 Required Fixes for Each Provider

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add ALL of these:

```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
https://sparkling-heliotrope-0d2ded.netlify.app/api/auth/callback/google
```

### 2. Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "OAuth2" section
4. Under "Redirects", add:

```
http://localhost:3000/api/auth/callback/discord
https://yourdomain.com/api/auth/callback/discord
https://sparkling-heliotrope-0d2ded.netlify.app/api/auth/callback/discord
```

### 3. Spotify OAuth Setup

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Select your app
3. Click "Edit Settings"
4. Under "Redirect URIs", add:

```
http://localhost:3000/api/auth/callback/spotify
https://yourdomain.com/api/auth/callback/spotify
https://sparkling-heliotrope-0d2ded.netlify.app/api/auth/callback/spotify
```

## 🔄 Environment Variables

Make sure your `.env.local` includes all these variables:

```bash
# NextAuth.js
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"  # Change to https://sparkling-heliotrope-0d2ded.netlify.app for production

# Database
DATABASE_URL="your-database-url"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Spotify OAuth
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# Stripe (for subscriptions)
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

## 🐛 Fixed Issues

### 1. Liked Songs Functionality
- ✅ Fixed column name mismatch (`song_id` vs `songs_id`)
- ✅ Fixed missing return statement in LikedContent component
- ✅ Added proper error handling

### 2. Database Schema Consistency
- ✅ Aligned Supabase and Prisma schemas
- ✅ Fixed foreign key references

### 3. Missing Dependencies
- ✅ Installed missing Supabase packages:
  - `@supabase/auth-helpers-nextjs`
  - `@supabase/auth-helpers-react`
  - `@supabase/auth-ui-react`
  - `@supabase/auth-ui-shared`
  - `@supabase/supabase-js`

## 🚀 Testing Your Fixes

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test liked songs functionality:
   - Try liking/unliking songs
   - Check if the liked songs page shows your liked songs

3. Test OAuth providers:
   - Try signing in with Google
   - Try signing in with Discord
   - Try signing in with Spotify

## 🌐 Production Deployment

When deploying to production (Netlify, etc.):

1. Update `NEXTAUTH_URL` to `https://sparkling-heliotrope-0d2ded.netlify.app`
2. Add production redirect URIs to all OAuth providers
3. Make sure all environment variables are set in Netlify dashboard
4. Set up your Neon DB connection string in Netlify environment variables

## 🔍 Troubleshooting

### "Redirect URI mismatch" error
- Check that all redirect URIs are added to your OAuth provider settings
- Make sure there are no trailing slashes
- Verify the exact URL format

### Liked songs not working
- Check browser console for errors
- Verify Neon DB connection
- Check if user is properly authenticated

### Database connection issues
- Verify DATABASE_URL is correct for your Neon database
- Check if your database is accessible
- Run `npx prisma db push` to sync schema
