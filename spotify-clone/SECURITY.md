# Environment Setup Script

## 🔐 Keeping Your API Keys Safe

This project uses environment variables to keep sensitive information secure. Your API keys should **never** be committed to git.

## 📋 Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your actual values:**
   - Replace all placeholder values with your real API keys
   - Get your keys from the respective provider dashboards
   - See `API_SETUP_GUIDE.md` for detailed instructions

3. **Verify your setup:**
   - ✅ `.env.local` exists and has your real keys
   - ✅ `.env.local` is in `.gitignore` 
   - ✅ `.env.local` is NOT committed to git

## 🚨 Security Checklist

- ✅ **Never** commit `.env.local` to git
- ✅ **Never** share your `.env.local` file
- ✅ **Never** put real API keys in documentation
- ✅ Use `.env.example` for documentation
- ✅ Use placeholder values in setup guides

## 🌐 For Deployment

When deploying to Netlify:
1. Copy values from your `.env.local`
2. Paste them into Netlify's environment variables dashboard
3. See `NETLIFY_DEPLOYMENT_CHECKLIST.md` for specific instructions

## 📁 File Structure

```
├── .env.example          # ✅ Safe to commit (placeholder values)
├── .env.local           # 🚨 NEVER commit (real API keys)
├── .gitignore           # ✅ Contains .env* to prevent commits
└── docs/                # ✅ All use placeholder values
```
