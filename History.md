
1.5.0 / 2015-12-17
==================

  * adding to .gitignore
  * exposing mongoose models

1.3.3 / 2015-07-02
==================

  * stop using startsWith for node 0.12

1.3.2 / 2015-07-02
==================

  * Merge pull request #6 from Authmaker/feature/bugfix
  * fixing "application wide" rate limiting
  * fixing strange date behavior because of mongoose coercing a moment object
  * fixing the requiredScope behavior for non rate limited verify

1.3.1 / 2015-07-02
==================

  * Merge pull request #5 from Authmaker/feature/authmakerCommon
  * implementing authmaker-common and refactoring

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
