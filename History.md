
1.3.0 / 2015-06-30
==================

  * Merge pull request #4 from Authmaker/feature/defaultScope
  * fixing the number of time periods allowed for the auditTrail
  * allowing the ability for a default scope

1.2.0 / 2015-06-30
==================

  * Merge pull request #3 from Authmaker/feature/auditTrailRateLimiting
  * changing rate limit to be >= to prevent +1 request getting through
  * preventing a bit of human error in defining scopes - stripping whitespace around segments
  * added error handling for malformed scopes and missing arguments
  * rate limiting working
  * Merge pull request #2 from Authmaker/feature/userScopes
  * adding getAccounts and getActiveScopes function to user
  * copying models over from authmaker
