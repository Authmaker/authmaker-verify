const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const fixture = rootRequire('test/fixtures/users');
const commonAccessTokenTests = rootRequire('test/helpers/commonAccessTokenTests');
const commonScopeAccessTokenTests = rootRequire('test/helpers/commonScopeAccessTokenTests');

const mongoVerify = rootRequire('lib/mongo/verify');

describe('mongo verify function', function () {
  beforeEach(function () {
    return fixture.init();
  });

  afterEach(function () {
    return fixture.reset();
  });

  commonAccessTokenTests(mongoVerify);
  commonScopeAccessTokenTests(mongoVerify);

  it('should succeed when there is a valid access token', function () {
    return expect(mongoVerify('valid_access_token_1')).to.be.fulfilled;
  });

  it('should succeed if the endpoint needs a scope permission and it is on the session', function () {
    return expect(mongoVerify('valid_face_permission', 'face_permissions')).to.be.fulfilled;
  });
});
