import { ContributionController } from '../src/controllers/contributionController';
import { Contribution } from '../src/database/models/contributionModel';
import { User } from '../src/database/models/userModel';
import httpMocks from 'node-mocks-http';

// Mock the models
jest.mock('../src/database/models/contributionModel');
jest.mock('../src/database/models/userModel');

const mockContribution = {
  id: 'contribution-123',
  userId: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
  groupId: 'ABC123',
  amount: 1000,
  paymentMethod: 'momo',
  contributionDate: new Date(),
  recordedBy: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUser = {
  id: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
  name: 'Test User',
  email: 'test@example.com',
  phoneNumber: '0700000000',
  role: 'user',
  groupId: 'ABC123',
  isApproved: true,
};

const mockLoggedInUser = {
  id: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};

describe('ContributionController - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createContribution', () => {
    it('should create a contribution successfully', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (Contribution.create as jest.Mock).mockResolvedValue(mockContribution);

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          userId: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
          groupId: 'ABC123',
          amount: 1000,
          paymentMethod: 'momo',
        },
        user: mockLoggedInUser,
      });
      const res = httpMocks.createResponse();

      await ContributionController.createContribution(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Contribution recorded successfully');
      expect(data.data).toMatchObject({
        id: mockContribution.id,
        userId: mockContribution.userId,
        groupId: mockContribution.groupId,
        amount: mockContribution.amount,
        paymentMethod: mockContribution.paymentMethod,
        recordedBy: mockContribution.recordedBy,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          userId: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
          groupId: 'ABC123',
          amount: 1000,
          paymentMethod: 'momo',
        },
        user: null,
      });
      const res = httpMocks.createResponse();

      await ContributionController.createContribution(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('User not authenticated');
    });

    it('should return 400 if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          userId: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1',
          groupId: 'ABC123',
          amount: 1000,
          paymentMethod: 'momo',
        },
        user: mockLoggedInUser,
      });
      const res = httpMocks.createResponse();

      await ContributionController.createContribution(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('User not found');
    });
  });

  describe('getUserContributions', () => {
    it('should get all contributions for a user', async () => {
      const mockContributions = [mockContribution];
      (Contribution.findAll as jest.Mock).mockResolvedValue(mockContributions);

      const req = httpMocks.createRequest({
        method: 'GET',
        params: { userId: 'c846a926-a0bc-4c5d-9fe4-852e47fe3bf1' },
      });
      const res = httpMocks.createResponse();

      await ContributionController.getUserContributions(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('User contributions retrieved successfully');
      expect(data.data).toHaveLength(1);
      expect(data.data[0]).toMatchObject({
        id: mockContribution.id,
        userId: mockContribution.userId,
        groupId: mockContribution.groupId,
        amount: mockContribution.amount,
        paymentMethod: mockContribution.paymentMethod,
        recordedBy: mockContribution.recordedBy,
      });
    });
  });

  describe('updateContribution', () => {
    // it('should update a contribution successfully', async () => {
    //   const updatedContribution = { ...mockContribution, amount: 1500 };
    //   (Contribution.findByPk as jest.Mock).mockResolvedValue(mockContribution);
    //   (mockContribution.update as jest.Mock) = jest.fn().mockResolvedValue(updatedContribution);

    //   const req = httpMocks.createRequest({
    //     method: 'PUT',
    //     params: { id: 'contribution-123' },
    //     body: { amount: 1500 },
    //   });
    //   const res = httpMocks.createResponse();

    //   await ContributionController.updateContribution(req, res);

    //   expect(res._getStatusCode()).toBe(200);
    //   const data = JSON.parse(res._getData());
    //   expect(data.success).toBe(true);
    //   expect(data.message).toBe('Contribution updated successfully');
    // });

    it('should return 404 if contribution not found', async () => {
      (Contribution.findByPk as jest.Mock).mockResolvedValue(null);

      const req = httpMocks.createRequest({
        method: 'PUT',
        params: { id: 'nonexistent-contribution' },
        body: { amount: 1500 },
      });
      const res = httpMocks.createResponse();

      await ContributionController.updateContribution(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Contribution not found');
    });
  });

  describe('deleteContribution', () => {
    // it('should delete a contribution successfully', async () => {
    //   (Contribution.findByPk as jest.Mock).mockResolvedValue(mockContribution);
    //   (mockContribution.destroy as jest.Mock) = jest.fn().mockResolvedValue(true);

    //   const req = httpMocks.createRequest({
    //     method: 'DELETE',
    //     params: { id: 'contribution-123' },
    //   });
    //   const res = httpMocks.createResponse();

    //   await ContributionController.deleteContribution(req, res);

    //   expect(res._getStatusCode()).toBe(200);
    //   const data = JSON.parse(res._getData());
    //   expect(data.success).toBe(true);
    //   expect(data.message).toBe('Contribution deleted successfully');
    // });

    it('should return 404 if contribution not found', async () => {
      (Contribution.findByPk as jest.Mock).mockResolvedValue(null);

      const req = httpMocks.createRequest({
        method: 'DELETE',
        params: { id: 'nonexistent-contribution' },
      });
      const res = httpMocks.createResponse();

      await ContributionController.deleteContribution(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Contribution not found');
    });
  });
});
