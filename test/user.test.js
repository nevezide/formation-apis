/* eslint-disable prefer-arrow-callback, func-names */
import chai from 'chai';
import chaiHttp from 'chai-http';
import crypto from 'crypto';

import helpers from './helpers.js';

const api = helpers.app;

chai.use(chaiHttp);

// IMPORTANT : For Mocha working, always use function () {}
// (never () => {})
describe('Users', function () {
  let users = {};
  let adminToken = '';
  let visitorToken = '';

  before(function () {
    users = helpers.seeder.data;
    adminToken = helpers.makeToken({
      id: users.user1.id,
      login: users.user1.login,
      role: users.user1.role,
    });
    visitorToken = helpers.makeToken({
      id: users.user2.id,
      login: users.user2.login,
      role: users.user2.role,
    });
  });

  beforeEach(async function () {
    await helpers.seeder.createUsers();
  });
  afterEach(async function () {
    await helpers.seeder.cleanAll();
  });

  it('GET /users should return a success response with all users', function (done) {
    chai.request(api)
      .get('/users')
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.deep.equal({
          data: [{
            id: users.user1.id,
            login: users.user1.login,
            role: users.user1.role,
          }, {
            id: users.user2.id,
            login: users.user2.login,
            role: users.user2.role,
          }],
        });
        done();
      });
  });
  it('POST /users should create the user and return a success response with the user', function (done) {
    const userData = {
      login: 'glouglou',
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    chai.request(api)
      .post('/users')
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(201);
        chai.expect(res.body).to.have.nested.property('data.id');
        chai.expect(res.body).to.nested.include({ 'data.login': userData.login });
        chai.expect(res.body).to.nested.include({ 'data.role': userData.role });
        done();
      });
  });
  it('POST /users should return a conflict response if the login already exists', function (done) {
    const userData = {
      login: users.user1.login,
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    chai.request(api)
      .post('/users')
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(409);
        chai.expect(res.body).to.deep.equal({
          error: `User with login ${userData.login} already exists`,
        });
        done();
      });
  });
  it('GET /users/:id should return a success response with found user', function (done) {
    chai.request(api)
      .get(`/users/${users.user1.id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.deep.equal({
          data: {
            id: users.user1.id,
            login: users.user1.login,
            role: users.user1.role,
          },
        });
        done();
      });
  });
  it('GET /users/:id should return not found response if the user does not exists', function (done) {
    const id = 'dbaadd25-6a7f-4e18-9aad-d178e5334154';
    chai.request(api)
      .get(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.body).to.deep.equal({
          error: `User ${id} not found`,
        });
        done();
      });
  });
  it('PUT /users/:id should update the user and return a success response with updated user', function (done) {
    const { id } = users.user2;
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    chai.request(api)
      .put(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.deep.equal({
          data: {
            id,
            login: userData.login,
            role: userData.role,
          },
        });
        done();
      });
  });
  it('PUT /users/:id should return not found response if the user does not exists', function (done) {
    const id = '4a76b80d-30f6-4e5a-9d21-c589179ae01d';
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    chai.request(api)
      .put(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.body).to.deep.equal({
          error: `User ${id} not found`,
        });
        done();
      });
  });
  it('DELETE /users/:id should return a success response', function (done) {
    const { id, login, role } = users.user1;
    chai.request(api)
      .delete(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.deep.equal({
          meta: {
            _deleted: {
              id, login, role,
            },
          },
        });
        done();
      });
  });
  it('DELETE /users/:id should return not found response if the user does not exists', function (done) {
    const id = '8aa4774c-301c-462a-81ac-3f55cbe70b10';
    chai.request(api)
      .delete(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.body).to.deep.equal({
          error: `User ${id} not found`,
        });
        done();
      });
  });
  it('GET /users should not return the password', function (done) {
    chai.request(api)
      .get('/users')
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.body).to.not.have.nested.property('data[0].password');
        chai.expect(res.body).to.not.have.nested.property('data[1].password');
        chai.expect(res.body).to.not.have.nested.property('data[2].password');
        done();
      });
  });
  it('POST /users should not return the password', function (done) {
    const userData = {
      login: 'glouglou',
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    chai.request(api)
      .post('/users')
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.body).to.not.have.nested.property('data.password');
        done();
      });
  });
  it('GET /users/:id should not return the password', function (done) {
    chai.request(api)
      .get(`/users/${users.user1.id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.body).to.not.have.nested.property('data.password');
        done();
      });
  });
  it('PUT /users/:id should not return the password', function (done) {
    const { id } = users.user2;
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    chai.request(api)
      .put(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.body).to.not.have.nested.property('data.password');
        done();
      });
  });
  it('DELETE /users/:id should not return the password', function (done) {
    const { id } = users.user1;
    chai.request(api)
      .delete(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((_, res) => {
        chai.expect(res.body).to.not.have.nested.property('meta._deleted.password');
        done();
      });
  });
  it('POST /users should store encrypted password', async function () {
    const userData = {
      login: 'glouglou',
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    const res = await chai.request(api)
      .post('/users')
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData);

    const user = await helpers.seeder.findUser(res.body.data.id);
    const hash = crypto.createHash('sha256').update(userData.password).digest('base64');

    chai.expect(user.password).equals(hash);
  });
  it('PUT /users/:id store encrypted password', async function () {
    const { id } = users.user2;
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    const res = await chai.request(api)
      .put(`/users/${id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(userData);

    const user = await helpers.seeder.findUser(res.body.data.id);
    const hash = crypto.createHash('sha256').update(userData.password).digest('base64');

    chai.expect(user.password).equals(hash);
  });
  it('GET /users should return unauthorized if no token provided', function (done) {
    chai.request(api)
      .get('/users')
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(401);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Missing authentication data',
        });
        done();
      });
  });
  it('POST /users should return unauthorized if no token provided', function (done) {
    const userData = {
      login: 'glouglou',
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    chai.request(api)
      .post('/users')
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(401);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Missing authentication data',
        });
        done();
      });
  });
  it('GET /users/:id should return unauthorized if no token provided', function (done) {
    chai.request(api)
      .get('/users/fe39351d-9f6c-4e5d-86c2-03f60b37e44f')
      .end((_, res) => {
        // chai.expect(res.statusCode).to.equal(401);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Missing authentication data',
        });
        done();
      });
  });
  it('PUT /users/:id should return unauthorized if no token provided', function (done) {
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    chai.request(api)
      .put('/users/fe39351d-9f6c-4e5d-86c2-03f60b37e44f')
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(401);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Missing authentication data',
        });
        done();
      });
  });
  it('DELETE /users/:id should return unauthorized if no token provided', function (done) {
    chai.request(api)
      .delete('/users/fe39351d-9f6c-4e5d-86c2-03f60b37e44f')
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(401);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Missing authentication data',
        });
        done();
      });
  });
  it('GET /users should return forbidden if invalid token', function (done) {
    const invalidToken = 'INVALID_TOKEN';
    chai.request(api)
      .get('/users')
      .set('authorization', `Bearer ${invalidToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(403);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Invalid authentication data',
        });
        done();
      });
  });
  it('POST /users should return forbidden if invalid token', function (done) {
    const invalidToken = 'INVALID_TOKEN';
    const userData = {
      login: 'glouglou',
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    chai.request(api)
      .post('/users')
      .set('authorization', `Bearer ${invalidToken}`)
      .send(userData)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(403);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Invalid authentication data',
        });
        done();
      });
  });
  it('GET /users/:id should return forbidden if invalid token', function (done) {
    const invalidToken = 'INVALID_TOKEN';
    chai.request(api)
      .get('/users/fe39351d-9f6c-4e5d-86c2-03f60b37e44f')
      .set('authorization', `Bearer ${invalidToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(403);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Invalid authentication data',
        });
        done();
      });
  });
  it('PUT /users/:id should return forbidden if invalid token', function (done) {
    const invalidToken = 'INVALID_TOKEN';
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    chai.request(api)
      .put('/users/fe39351d-9f6c-4e5d-86c2-03f60b37e44f')
      .set('authorization', `Bearer ${invalidToken}`)
      .send(userData)
      .end((_, res) => {
        // chai.expect(res.statusCode).to.equal(403);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Invalid authentication data',
        });
        done();
      });
  });
  it('DELETE /users/:id should return forbidden if invalid token', function (done) {
    const invalidToken = 'INVALID_TOKEN';
    chai.request(api)
      .delete('/users/fe39351d-9f6c-4e5d-86c2-03f60b37e44f')
      .set('authorization', `Bearer ${invalidToken}`)
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(403);
        chai.expect(res.headers).to.not.have.property('authorization');
        chai.expect(res.body).to.deep.equal({
          error: 'Invalid authentication data',
        });
        done();
      });
  });
  it('GET /users should return forbidden if user role not admin', async function () {
    const promises = [visitorToken].map(async (token) => {
      const res = await chai.request(api)
        .get('/users')
        .set('authorization', `Bearer ${token}`);

      chai.expect(res.statusCode).to.equal(403);
      chai.expect(res.body).to.deep.equal({
        error: 'Access forbidden',
      });
    });

    return Promise.all(promises);
  });
  it('POST /users should return forbidden if user role not admin', async function () {
    const userData = {
      login: 'glouglou',
      password: 'PlnPnId7Zq7K1OqdWnzpFlS0/Ds9980d9ZZiixZmfo8=',
      role: 'visitor',
    };
    const promises = [visitorToken].map(async (token) => {
      const res = await chai.request(api)
        .post('/users')
        .set('authorization', `Bearer ${token}`)
        .send(userData);

      chai.expect(res.statusCode).to.equal(403);
      chai.expect(res.body).to.deep.equal({
        error: 'Access forbidden',
      });
    });

    return Promise.all(promises);
  });
  it('GET /users/:id should return forbidden if user role not admin', async function () {
    const promises = [visitorToken].map(async (token) => {
      const res = await chai.request(api)
        .get(`/users/${users.user1.id}`)
        .set('authorization', `Bearer ${token}`);

      chai.expect(res.statusCode).to.equal(403);
      chai.expect(res.body).to.deep.equal({
        error: 'Access forbidden',
      });
    });

    return Promise.all(promises);
  });
  it('PUT /users/:id should return forbidden if user role not admin', async function () {
    const { id } = users.user2;
    const userData = {
      login: 'meuhmeuh',
      password: 'y8qYNwiHLYmrkdnkwSsp4CBXfK9muoHlYT337M9aeTM=',
      role: 'visitor',
    };
    const promises = [visitorToken].map(async (token) => {
      const res = await chai.request(api)
        .put(`/users/${id}`)
        .set('authorization', `Bearer ${token}`)
        .send(userData);

      chai.expect(res.statusCode).to.equal(403);
      chai.expect(res.body).to.deep.equal({
        error: 'Access forbidden',
      });
    });

    return Promise.all(promises);
  });
  it('DELETE /users/:id should return forbidden if user role not admin', async function () {
    const { id } = users.user1;
    const promises = [visitorToken].map(async (token) => {
      const res = await chai.request(api)
        .delete(`/users/${id}`)
        .set('authorization', `Bearer ${token}`);

      chai.expect(res.statusCode).to.equal(403);
      chai.expect(res.body).to.deep.equal({
        error: 'Access forbidden',
      });
    });

    return Promise.all(promises);
  });
});
