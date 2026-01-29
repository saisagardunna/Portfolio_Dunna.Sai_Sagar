---
description: Deploy the application to production
---

# Deploy Workflow

This workflow helps you deploy your application to various platforms.

## Steps

1. **Pre-deployment checks**:
   - Ensure all changes are committed to git
   - Run build command to verify production build works
   - Check environment variables are configured
2. **Git operations** (if deploying via git):
   ```powershell
   git add .
   git commit -m "Deploy: [description]"
   git push origin main
   ```
3. **Platform-specific deployment**:
   - **Vercel**: Typically auto-deploys from git push
   - **Netlify**: Auto-deploys from git or use `netlify deploy --prod`
   - **Other platforms**: Follow platform-specific commands
4. **Verify deployment**: 
   - Check deployment logs
   - Visit the production URL
   - Test critical functionality
5. **Post-deployment**: Monitor for any errors or issues
