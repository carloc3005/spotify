# Netlify Deployment Checklist

## 🌐 Your Netlify URL
`https://sparkling-heliotrope-0d2ded.netlify.app`

## ✅ Pre-Deployment Checklist

### 1. Environment Variables in Netlify
Set these in your Netlify dashboard (Site settings > Environment variables):

```bash
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://sparkling-heliotrope-0d2ded.netlify.app"
DATABASE_URL="your-neon-database-connection-string"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

**Note:** Copy your actual values from your `.env.local` file when setting these up in Netlify.

### 2. OAuth Provider Setup
Add these redirect URIs to your OAuth providers:

**Google OAuth:**
- `https://sparkling-heliotrope-0d2ded.netlify.app/api/auth/callback/google`

**Discord OAuth:**
- `https://sparkling-heliotrope-0d2ded.netlify.app/api/auth/callback/discord`

**Spotify OAuth:**
- `https://sparkling-heliotrope-0d2ded.netlify.app/api/auth/callback/spotify`

### 3. Database Setup
- ✅ Neon DB is configured
- ✅ Prisma schema is up to date
- ✅ Database migrations are applied

### 4. Build Settings
Your `netlify.toml` should handle the build configuration.

## 🚀 Post-Deployment

1. Test OAuth login with each provider
2. Test liked songs functionality
3. Test Stripe integration (if configured)
4. Check browser console for any errors

## 🔧 Troubleshooting

If you encounter issues:
1. Check Netlify build logs
2. Verify all environment variables are set
3. Test OAuth redirect URIs
4. Check database connectivity
