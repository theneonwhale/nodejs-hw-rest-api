const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');

require('dotenv').config();
const { User, newUser } = require('../model/__mocks__/data');
const app = require('../app');

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
User.token = token;

// jest.mock('../model/contacts.js');
jest.mock('../model/users.js');
// jest.mock('cloudinary');

describe('Testing the route api/users', () => {
  it('should return 201 after registration', async done => {
    const res = await request(app)
      .post(`/api/users/auth/register`)
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 409 after registration with existed email', async done => {
    const res = await request(app)
      .post(`/api/users/auth/register`)
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(409);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 200 after login', async done => {
    const res = await request(app)
      .post(`/api/users/auth/login`)
      .send(newUser)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 401 after wrong login', async done => {
    const res = await request(app)
      .post(`/api/users/auth/login`)
      .send({ email: 'fake@tets.com', password: '123456' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 200 after update subscription', async done => {
    const res = await request(app)
      .patch('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ subscription: 'pro' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 200 after upload avatar', async done => {
    const buffer = await fs.readFile('./test/default.jpg');
    const res = await request(app)
      .patch(`/api/users/avatars`)
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', buffer, 'default.jpg');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    expect(res.body.data).toHaveProperty('avatarURL');
    done();
  });

  it('should return 204 after logout', async done => {
    const res = await request(app)
      .post('/api/users/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(204);
    done();
  });
});
