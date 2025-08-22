# Neon Migration Guide

## 1. Create Neon Database
1. Go to https://neon.tech
2. Sign up with GitHub (free)
3. Create new project
4. Copy the connection string

## 2. Update Environment Variables
Replace in .env.local:
```
# Remove Supabase vars
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...

# Add Neon
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Add NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Dependencies to Change
Remove:
- @supabase/supabase-js
- @supabase/auth-helpers-nextjs  
- @supabase/auth-helpers-react
- @supabase/auth-ui-react
- @supabase/auth-ui-shared

Add:
- next-auth
- @next-auth/prisma-adapter
- prisma
- @prisma/client
- uploadthing (for file uploads)

## 4. Database Schema (Prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NextAuth tables
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  songs         Song[]
  likedSongs    LikedSong[]
  subscription  Subscription?
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Your app tables
model Song {
  id         String   @id @default(cuid())
  userId     String
  author     String
  title      String
  songPath   String
  imagePath  String
  createdAt  DateTime @default(now())
  
  user       User @relation(fields: [userId], references: [id])
  likedBy    LikedSong[]
}

model LikedSong {
  id        String   @id @default(cuid())
  userId    String
  songId    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  song Song @relation(fields: [songId], references: [id])
  
  @@unique([userId, songId])
}

model Subscription {
  id                 String    @id @default(cuid())
  userId             String    @unique
  stripeCustomerId   String?   @unique
  stripeSubscriptionId String? @unique
  stripePriceId      String?
  stripeCurrentPeriodEnd DateTime?
  
  user User @relation(fields: [userId], references: [id])
}
```

## Benefits of This Migration:
- ✅ No database sleeping (Neon free tier)
- ✅ Better auth system (NextAuth.js)
- ✅ Type safety (Prisma)
- ✅ All free tiers
- ✅ Easier to work with
