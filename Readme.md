[![Build Status](https://travis-ci.org/Authmaker/authmaker-verify.svg?branch=master)](https://travis-ci.org/Authmaker/authmaker-verify)
[![Code Climate](https://codeclimate.com/github/Authmaker/authmaker-verify/badges/gpa.svg)](https://codeclimate.com/github/Authmaker/authmaker-verify)

[![Version npm](https://img.shields.io/npm/v/authmaker-verify.svg)](https://www.npmjs.com/package/authmaker-verify)
[![Dependencies](https://david-dm.org/Authmaker/authmaker-verify.svg)](https://david-dm.org/Authmaker/authmaker-verify)
[![npm Downloads](https://img.shields.io/npm/dm/authmaker-verify.svg)](https://www.npmjs.com/package/authmaker-verify)


#### mongoRateLimited: function(access_token, tag, defaultScope)
#### mongo: function(access_token, requiredScope)
#### connectMongo: function(nconf)
#### rateLimited: function()
#### auditCount: function(access_token, tag, since)
Use this function to get the count of a particular tag in the audit trail. If you pass the optional `since` parameter it will limit the count to number of audit trail entries since that time. Whatever is passed with the `since` parameter will be passed to `moment(since)` to build a date object directly so you can use any of the [valid parse objects for moment](http://momentjs.com/docs/#/parsing/)
