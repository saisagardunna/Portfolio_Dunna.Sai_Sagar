---
description: Run tests for the application
---

# Test Workflow

This workflow helps you run tests for your application.

## Steps

// turbo-all

1. **Check test configuration**: Verify test framework is set up (Jest, Vitest, etc.)
2. **Determine test type**:
   - All tests: `npm test` or `npm run test`
   - Specific test file: `npm test -- <filename>`
   - Watch mode: `npm test -- --watch`
   - Coverage: `npm test -- --coverage`
3. **Run tests**:
   ```powershell
   npm test
   ```
4. **Analyze results**: Review test output for passes, failures, and coverage
5. **Debug failures**: If tests fail, investigate and fix issues
6. **Update tests**: Modify or add tests as needed based on results
