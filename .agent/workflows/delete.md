---
description: Delete files or directories safely
---

# Delete Workflow

This workflow helps you safely delete files or directories.

## Steps

1. **Confirm target**: Ask the user to confirm which file(s) or directory/directories they want to delete
2. **Verify path exists**: Check that the target path exists before attempting deletion
3. **Safety check**: 
   - For important files (like package.json, .env, config files), ask for explicit confirmation
   - For directories, warn about recursive deletion
4. **Execute deletion**: Use the `rm` command (PowerShell: `Remove-Item`) to delete
   ```powershell
   Remove-Item -Path "path\to\file" -Force
   # For directories:
   Remove-Item -Path "path\to\directory" -Recurse -Force
   ```
5. **Confirm completion**: Verify the deletion was successful and inform the user
