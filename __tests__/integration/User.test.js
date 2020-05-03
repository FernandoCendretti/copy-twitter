/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await User.create({
      name: 'Fernando',
      email: 'fernando@hotmail.com',
      password: '123456',
    });
  });

  afterEach(async () => {
    await truncate();
  });

  describe(' /POST', () => {
    it('should be able to register', async () => {
      const user = {
        name: 'Rogerio',
        email: 'rogerio@hotmail.com',
        password: '123123',
      };

      const { body } = await request(app)
        .post('/users')
        .send(user)
        .expect(200);

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
    });

    it('should not be able to register with duplicated email ', async () => {
      const { status, body } = await request(app)
        .post('/users')
        .send({
          name: 'Fernando',
          email: 'fernando@hotmail.com',
          password: '123123',
        });

      expect(status).toBe(400);
      expect(body.error).toBe('User already exists');
    });

    it('should not be able to register when the email does not contain "@" and "."', async () => {
      const user = {
        name: 'Rogerio',
        email: 'rogerio',
        password: '123123',
      };

      const { status, body } = await request(app)
        .post('/users')
        .send(user);

      expect(status).toBe(403);
      expect(body.error).toBe('Validation Fails');
    });

    it('should not be able to register when name, email and password are empty', async () => {
      const user = {
        name: '',
        email: '',
        password: '',
      };

      const { status, body } = await request(app)
        .post('/users')
        .send(user);

      expect(status).toBe(403);
      expect(body.error).toBe('Validation Fails');
    });

    it('should not be able to register when password is less than 6', async () => {
      const user = {
        name: 'Rogerio',
        email: 'rogerio@hotmail.com',
        password: '123',
      };

      const { status, body } = await request(app)
        .post('/users')
        .send(user);

      expect(status).toBe(403);
      expect(body.error).toBe('Validation Fails');
    });
  });

  describe(' /PUT', () => {
    it('should not uptade when token is not provide', async () => {
      const { body } = await request(app)
        .put('/users')
        .expect(401);
      expect(body.error).toBe('Token not provided');
    });

    it('should not uptade when token is invalid', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc';

      const { body } = await request(app)
        .put('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
      expect(body.error).toBe('Token invalid');
    });

    it('should not update when wrong password', async () => {
      const userLogin = await request(app)
        .post('/sessions')
        .send({
          email: 'fernando@hotmail.com',
          password: '123456',
        });

      const { body } = await request(app)
        .put('/users')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .send({
          email: 'joao@gmail.com',
          oldPassword: '12345',
        })
        .expect(401);

      expect(body.error).toBe('Password does not match');
    });

    it('should update user datas', async () => {
      const userLogin = await request(app)
        .post('/sessions')
        .send({
          email: 'fernando@hotmail.com',
          password: '123456',
        });

      const { body } = await request(app)
        .put('/users')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .send({
          name: 'João',
          email: 'joao@gmail.com',
          oldPassword: '123456',
          password: '123123',
        })
        .expect(200);

      expect(body.name).toBe('João');
      expect(body.email).toBe('joao@gmail.com');
    });
  });

  describe(' /GET', () => {
    it('should not uptade when token is not provide', async () => {
      const { body } = await request(app)
        .put('/users')
        .expect(401);
      expect(body.error).toBe('Token not provided');
    });

    it('should not uptade when token is invalid', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc';

      const { body } = await request(app)
        .put('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
      expect(body.error).toBe('Token invalid');
    });
    it('should return user data', async () => {
      const userLogin = await request(app)
        .post('/sessions')
        .send({
          email: 'fernando@hotmail.com',
          password: '123456',
        });

      const { body } = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .expect(200);

      expect(body.name).toBe('Fernando');
      expect(body.email).toBe('fernando@hotmail.com');
    });
  });
});
