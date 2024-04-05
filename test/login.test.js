/* eslint-disable prefer-arrow-callback, func-names */
import chai from 'chai';
import chaiHttp from 'chai-http';

import helpers from './helpers.js';

const api = helpers.app;

chai.use(chaiHttp);

// IMPORTANT : For Mocha working, always use function () {}
// (never () => {})

describe('Login', function () {
  let users = {};
  let adminToken = '';

  before(function () {
    users = helpers.seeder.data;
    adminToken = helpers.makeToken({
      id: users.user1.id,
      login: users.user1.login,
      role: users.user1.role,
    });
  });

  beforeEach(async function () {
    await helpers.seeder.createUsers();
  });
  afterEach(async function () {
    await helpers.seeder.cleanAll();
  });

  it('POST /login should return success with JWT if credentials valid', function (done) {
    const credentials = {
      login: users.user1.login,
      password: users.user1.password,
    };
    chai.request(api)
      .post('/login')
      .send(credentials)
      .end((_, res) => {
        chai.expect(res.headers.authorization).to.equal(`Bearer ${adminToken}`);
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.be.empty;// eslint-disable-line no-unused-expressions
        done();
      });
  });
  it('POST /login should return forbidden if credentials not valid', function (done) {
    const credentials = {
      login: users.user1.login,
      password: 'toto',
    };
    chai.request(api)
      .post('/login')
      .send(credentials)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(403);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Access not allowed with provided credentials',
        });
        done();
      });
  });
});
