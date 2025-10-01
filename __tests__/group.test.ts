import { describe, it, expect, jest, beforeAll } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../src/index';
import { Group } from '../src/database/models/groupModel';

const request = supertest(app);
export const userResponse = {
  token: '',
};
const prefix = '/api/';
describe('Group Operations', () => {
  describe('Get All Groups', () => {
    it('should get all groups successfully', async () => {
      const res = await request
        .get(`${prefix}groups`)
        .set('Authorization', `Bearer ${userResponse.token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should handle database error when getting groups', async () => {
      jest.spyOn(Group, 'findAll').mockRejectedValue(new Error());

      const res = await request
        .get(`${prefix}groups`)
        .set('Authorization', `Bearer ${userResponse.token}`);
      expect(res.status).toBe(500);
    });
  });

  describe('Create Group', () => {
    it('should create group successfully', async () => {
      const res = await request
        .post(`${prefix}groups`)
        .set('Authorization', `Bearer ${userResponse.token}`)
        .send({
          name: 'Test Group',
          description: 'This is a test group description',
          location: ['Kigali', 'Gasabo'],
          meetingLocation: 'Ndera Hall',
          minContribution: 500,
          contact: '078880000',
          email: 'group@test.com',
          interestRate: 5.5,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Group created successfully');
    });

    it('should fail with invalid group data', async () => {
      const res = await request
        .post(`${prefix}groups`)
        .set('Authorization', `Bearer ${userResponse.token}`)
        .send({
          name: '',
          description: '',
        });

      expect(res.status).toBe(400);
    });

    it('should handle database error when creating group', async () => {
      jest.spyOn(Group, 'create').mockRejectedValue(new Error());

      const res = await request
        .post(`${prefix}groups`)
        .set('Authorization', `Bearer ${userResponse.token}`)
        .send({
          name: 'Test Group',
          description: 'Some description',
          location: ['Kigali'],
          meetingLocation: 'Ndera Hall',
          minContribution: 500,
          contact: '078880000',
          email: 'group@test.com',
        });

      expect(res.status).toBe(500);
    });
  });

  describe('Get Single Group', () => {
    it('should get group by id successfully', async () => {
      const group = await Group.create({
        name: 'Single Test Group',
        description: 'A description for single group test',
        location: ['Kigali'],
        meetingLocation: 'Kimironko',
        minContribution: 300,
        contact: '078880001',
        email: 'single@test.com',
      });

      const res = await request
        .get(`${prefix}groups/${group.id}`)
        .set('Authorization', `Bearer ${userResponse.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Group retrieved successfully');
    });

    it('should return 404 for group that does not exist', async () => {
      const res = await request
        .get(`${prefix}groups/non-existent-id`)
        .set('Authorization', `Bearer ${userResponse.token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Group not found');
    });
  });

  describe('Update Group', () => {
    it('should update group successfully', async () => {
      const group = await Group.create({
        name: 'Old Name',
        description: 'Old Description',
        location: ['Kigali'],
        meetingLocation: 'Kacyiru',
        minContribution: 400,
        contact: '078880002',
        email: 'update@test.com',
      });

      const res = await request
        .put(`${prefix}groups/${group.id}`)
        .set('Authorization', `Bearer ${userResponse.token}`)
        .send({
          name: 'Updated Group Name',
          description: 'Updated description',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Group updated successfully');
    });
  });

  describe('Delete Group', () => {
    it('should delete group successfully', async () => {
      const group = await Group.create({
        name: 'Delete Test Group',
        description: 'Group to be deleted',
        location: ['Kigali'],
        meetingLocation: 'Remera',
        minContribution: 250,
        contact: '078880003',
        email: 'delete@test.com',
      });

      const res = await request
        .delete(`${prefix}groups/${group.id}`)
        .set('Authorization', `Bearer ${userResponse.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Group deleted successfully');
    });
  });
});
