module.exports = {
  "env": {
    "node": true
  },
  "extends": "airbnb-base",
  "rules" : {
    "new-cap": [2 , { "capIsNewExceptions": ["Q", "ObjectId"] }],
    "no-underscore-dangle": [2, { "allow": ["_id"] }]
  },
  overrides: [{
    files: [
      'test/**/*.js',
    ],
    env: {
      mocha: true
    },
    globals: {
      rootRequire: true
    },
    rules: {
      "prefer-destructuring": 0,
      "prefer-arrow-callback": 0,
      "func-names": 0,
      'no-unused-expressions': 0,
    }
  }]
}
