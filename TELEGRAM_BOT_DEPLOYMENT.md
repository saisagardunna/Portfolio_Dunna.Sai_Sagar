# Telegram Bot Deployment Guide

## ✅ Files Created for Cloud Deployment

1. **`api/telegram-webhook.js`** - Serverless webhook endpoint for Telegram
2. **`scripts/set-webhook.js`** - Helper script to configure Telegram webhook
3. **Updated `vercel.json`** - Vercel configuration for API routes
4. **Updated `.env.local`** - Added `TELEGRAM_BOT_TOKEN`

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Telegram bot webhook for Vercel"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Add Environment Variable:
   - **Name**: `TELEGRAM_BOT_TOKEN`
   - **Value**: `8269338081:AAFbrSNSSrkwoqoL6ujj3-eHyXAyjpG_jNU`
4. Click **Deploy**

### Step 3: Set Telegram Webhook
After deployment completes, you'll get a URL like: `https://your-app.vercel.app`

Run this command locally:
```bash
node scripts/set-webhook.js https://your-app.vercel.app/api/telegram-webhook
```

Replace `your-app.vercel.app` with your actual Vercel domain.

## 🎯 Testing Your Bot

Once deployed and webhook is set:
1. Open Telegram on your phone
2. Search for `@Sagar_portfoliobot`
3. Send `/start` to begin
4. Try commands like `/projects`, `/about`, `/contact`

## 📱 Controlling from Your Phone

The bot will work 24/7 from anywhere! You can:
- Browse your projects
- Share your contact info
- Get information about your skills
- All responses are instant and serverless

## 🔒 Security Notes

- Never commit `.env.local` to GitHub (it's in `.gitignore`)
- Always set `TELEGRAM_BOT_TOKEN` in Vercel's dashboard
- Keep your bot token secret

## 🛠️ Troubleshooting

If the bot doesn't respond:
1. Check Vercel deployment logs
2. Verify environment variable is set in Vercel
3. Confirm webhook was set successfully
4. Test the webhook endpoint: `https://your-app.vercel.app/api/telegram-webhook`
