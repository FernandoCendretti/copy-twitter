/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/app/models/User';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate the user with the correct credentials', async () => {
    const user = await User.create({
      name: 'João',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const { body } = await request(app)
      .post('/sessions/')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    expect(body).toHaveProperty('user');
    expect(body).toHaveProperty('token');
  });

  it('should not authenticate the user with the wrong password', async () => {
    const user = await User.create({
      name: 'João',
      email: 'joao@gmail.com',
      password: '123123',
    });

    const { body } = await request(app)
      .post('/sessions/')
      .send({
        email: user.email,
        password: '123456',
      })
      .expect(401);

    expect(body.error).toBe('Password does not match');
  });

  it('should not authenticate the with email and password is empty', async () => {
    const { body } = await request(app)
      .post('/sessions/')
      .send({
        email: '',
        password: '',
      })
      .expect(403);

    expect(body.error).toBe('Validation Fails');
  });

  it('should not be able to authenticate when the email does not contain "@" and "."', async () => {
    const { body } = await request(app)
      .post('/sessions/')
      .send({
        email: 'fenando',
        password: '123123',
      })
      .expect(403);

    expect(body.error).toBe('Validation Fails');
  });

  it('should not be able to authenticate when password is less than 6', async () => {
    const { body } = await request(app)
      .post('/sessions/')
      .send({
        email: 'fenando@email.com',
        password: '123',
      })
      .expect(403);

    expect(body.error).toBe('Validation Fails');
  });

  it('should not be able to authenticate when user not exists', async () => {
    const { body } = await request(app)
      .post('/sessions/')
      .send({
        email: 'fenando@email.com',
        password: '123123',
      })
      .expect(401);

    expect(body.error).toBe('User not exists');
  });
});
