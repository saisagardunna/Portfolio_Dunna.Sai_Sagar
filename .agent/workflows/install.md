---
description: Install dependencies or packages
---

# Install Workflow

This workflow helps you install project dependencies or add new packages.

## Steps

// turbo-all

1. **Determine installation type**:
   - Full install: `npm install` (install all package.json dependencies)
   - Add new package: `npm install <package-name>`
   - Dev dependency: `npm install --save-dev <package-name>`
2. **Execute installation**:
   ```powershell
   npm install
   # or for specific package:
   npm install <package-name>
   ```
3. **Verify installation**: Check that package.json and package-lock.json are updated
4. **Test the installation**: If a specific package was added, verify it works as expected
5. **Commit changes**: Remind user to commit updated package files if needed
