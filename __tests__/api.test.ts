import request from 'supertest';
import { app } from '../src/index';

describe('API Endpoints', () => {
  let token = '';
  let userId = '';

  it('should create a new user', async () => {
    const uniqueSuffix = Date.now();
    const res = await request(app)
      .post('/api/auth/users')
      .send({
        name: 'Test User',
        email: `testuser${uniqueSuffix}@example.com`,
        password: 'password123',
        phoneNumber: `070${uniqueSuffix}`,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('should login and return a token', async () => {
    const res = await request(app)
  .post('/api/auth/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should complete user profile', async () => {
    const res = await request(app)
  .put('/api/auth/users/complete-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        phoneNumber: '0711111111',
        groupId: '11111111-1111-1111-1111-111111111111',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.phoneNumber).toBe('0711111111');
    expect(res.body.user.groupId).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('should get all users', async () => {
    const res = await request(app)
  .get('/api/auth/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user by ID', async () => {
    const res = await request(app)
      .get(`/api/auth/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    if (Array.isArray(res.body)) {
      const found = res.body.find((u: any) => u.id === userId);
      expect(found).toBeDefined();
    } else {
      expect(res.body).toHaveProperty('id', userId);
    }
  });
});
