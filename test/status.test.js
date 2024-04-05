/* eslint-disable prefer-arrow-callback, func-names */
import chai from 'chai';
import chaiHttp from 'chai-http';
import helpers from './helpers.js';

const api = helpers.app;

chai.use(chaiHttp);

// IMPORTANT : For Mocha working, always use function () {}
// (never () => {})
describe('Status Check', function () {
  it('GET /statusCheck should return a success response with api ok', function (done) {
    chai.request(api)
      .get('/statusCheck')
      .end((_, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.deep.equal({
          data: {
            api: 'ok',
          },
        });
        done();
      });
  });
  it('GET /statusCheck should return a success response with db status');
});
