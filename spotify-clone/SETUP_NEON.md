# Neon Database Setup Script

## Step 1: Create Neon Database
1. Go to https://neon.tech
2. Sign up with GitHub (free)
3. Create a new project
4. Copy the connection string

## Step 2: Install Dependencies
Run in PowerShell:
```powershell
npm install
```

## Step 3: Set up Environment Variables
1. Copy `.env.example` to `.env.local`
2. Replace `DATABASE_URL` with your Neon connection string
3. Generate a secret for `NEXTAUTH_SECRET`:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
4. Set `NEXTAUTH_URL` to your domain (http://localhost:3000 for dev)

## Step 4: Set up Database
```powershell
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 5: Set up UploadThing (for file uploads)
1. Go to https://uploadthing.com
2. Sign up and create a new app
3. Copy the App ID and Secret to your .env.local

## Step 6: Test the Setup
```powershell
npm run dev
```

## Step 7: View Database (optional)
```powershell
npm run db:studio
```

## Migration Complete! 🎉

Your app now uses:
- ✅ Neon PostgreSQL (no sleeping!)
- ✅ NextAuth.js (better auth)
- ✅ Prisma (better DX)
- ✅ UploadThing (file uploads)
- ✅ All free tiers

## Next Steps:
1. Update your components to use NextAuth instead of Supabase
2. Replace Supabase file uploads with UploadThing
3. Update your database queries to use Prisma
