import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/index';

describe('Basic API Test', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });
});
