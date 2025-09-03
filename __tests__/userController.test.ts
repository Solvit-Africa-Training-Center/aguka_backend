import userController from '../src/controller/userController';
import httpMocks from 'node-mocks-http';
import userService from '../src/service/userService';

jest.mock('../src/service/userService');

const mockUser = {
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  phoneNumber: '0700000000',
  role: 'user',
  groupId: null,
};

describe('UserController', () => {
  it('should handle non-Error thrown in createUser', async () => {
    (userService.createUser as jest.Mock).mockImplementation(() => { throw 'string error'; });
    const req = httpMocks.createRequest({ method: 'POST', body: { name: 'Test', email: 'test@example.com', password: 'pass', phoneNumber: '0700000000' } });
    const res = httpMocks.createResponse();
    await userController.createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Failed to create a user');
    expect(res._getJSONData().error).toBe('string error');
  });

  it('should handle non-Error thrown in updateUser', async () => {
    (userService.updateUser as jest.Mock).mockImplementation(() => { throw 123; });
    const req = httpMocks.createRequest({ method: 'PUT', params: { id: 'test-id' }, body: { name: 'Updated User' } });
    const res = httpMocks.createResponse();
    await userController.updateUser(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('123');
  });

  it('should handle non-Error thrown in deleteUser', async () => {
    (userService.deleteUser as jest.Mock).mockImplementation(() => { throw null; });
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 'test-id' } });
    const res = httpMocks.createResponse();
    await userController.deleteUser(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('null');
  });

  it('should handle non-Error thrown in assigningGroup', async () => {
    (userService.assignGroup as jest.Mock).mockImplementation(() => { throw undefined; });
    const req = httpMocks.createRequest({ method: 'PUT', params: { id: 'test-id' }, body: { groupId: 'group-id' } });
    const res = httpMocks.createResponse();
    await userController.assigningGroup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('undefined');
  });

  it('should handle non-Error thrown in updateUserRole', async () => {
    (userService.updateUser as jest.Mock).mockImplementation(() => { throw { foo: 'bar' }; });
    const req = httpMocks.createRequest({ method: 'PUT', params: { id: 'test-id' }, body: { role: 'admin' } });
    const res = httpMocks.createResponse();
    await userController.updateUserRole(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('[object Object]');
  });

  it('should handle non-Error thrown in completeProfile', async () => {
    jest.spyOn(require('../src/service/authService').default, 'completeProfile').mockImplementation(() => { throw false; });
    const req = httpMocks.createRequest({ method: 'PUT', body: { phoneNumber: '0711111111', groupId: 'group-id' }, user: { id: 'test-id' } });
    const res = httpMocks.createResponse();
    await userController.completeProfile(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('false');
  });

  it('should handle non-Error thrown in getAllUsers', async () => {
    (userService.getAllUsers as jest.Mock).mockImplementation(() => { throw [1,2,3]; });
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
    await userController.getAllUsers(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Failed to retrieve users');
    expect(res._getJSONData().error).toBe('1,2,3');
  });

  it('should handle non-Error thrown in getUserById', async () => {
    (userService.getUserById as jest.Mock).mockImplementation(() => { throw Symbol('fail'); });
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 'test-id' } });
    const res = httpMocks.createResponse();
    await userController.getUserById(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Failed to retrieve user');
    expect(typeof res._getJSONData().error).toBe('string');
  });

  it('should handle non-Error thrown in loginLocal', async () => {
    jest.spyOn(require('../src/service/authService').default, 'loginLocal').mockImplementation(() => { throw 404; });
    const req = httpMocks.createRequest({ method: 'POST', body: { identifier: 'test', password: 'pass' } });
    const res = httpMocks.createResponse();
    await userController.loginLocal(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe(404);
  });

  it('should handle non-Error thrown in loginGoogleCallback', async () => {
    jest.spyOn(require('../src/service/authService').default, 'generateToken').mockImplementation(() => { throw 500; });
    const req = httpMocks.createRequest({ method: 'GET', user: { id: 'test-id' } });
    const res = httpMocks.createResponse();
    await userController.loginGoogleCallback(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe(500);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

    it('should return 400 if createUser missing required fields', async () => {
      const req = httpMocks.createRequest({ method: 'POST', body: { email: 'test@example.com', password: 'pass', phoneNumber: '0700000000' } });
      const res = httpMocks.createResponse();
      await userController.createUser(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('Name, email, phoneNumber, and password are required');
    });

    it('should return 400 if createUser service throws error', async () => {
      (userService.createUser as jest.Mock).mockImplementation(() => { throw new Error('Create error'); });
      const req = httpMocks.createRequest({ method: 'POST', body: { name: 'Test', email: 'test@example.com', password: 'pass', phoneNumber: '0700000000' } });
      const res = httpMocks.createResponse();
      await userController.createUser(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('Failed to create a user');
      expect(res._getJSONData().error).toBe('Create error');
    });

    it('should get all users', async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);
      const req = httpMocks.createRequest({ method: 'GET' });
      const res = httpMocks.createResponse();
      await userController.getAllUsers(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([mockUser]);
    });

    it('should get user by id', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      const req = httpMocks.createRequest({ method: 'GET', params: { id: 'test-id' } });
      const res = httpMocks.createResponse();
      await userController.getUserById(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockUser);
    });

    it('should return 404 if getUserById not found', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);
      const req = httpMocks.createRequest({ method: 'GET', params: { id: 'not-found' } });
      const res = httpMocks.createResponse();
      await userController.getUserById(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('User not found');
    });

    it('should return 404 if deleteUser not found', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue(false);
      const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 'not-found' } });
      const res = httpMocks.createResponse();
      await userController.deleteUser(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('User not found');
    });

    it('should return 404 if updateUser not found', async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue(null);
      const req = httpMocks.createRequest({ method: 'PUT', params: { id: 'not-found' }, body: { name: 'Updated User' } });
      const res = httpMocks.createResponse();
      await userController.updateUser(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe('User not found');
    });

    it('should return 400 if assigningGroup missing groupId', async () => {
      const req = httpMocks.createRequest({ method: 'PUT', params: { id: 'test-id' }, body: {} });
      const res = httpMocks.createResponse();
      await userController.assigningGroup(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('groupId is required');
    });

    it('should return 400 if completeProfile missing phoneNumber or groupId', async () => {
      const req = httpMocks.createRequest({ method: 'PUT', body: { phoneNumber: '0711111111' }, user: { id: 'test-id' } });
      const res = httpMocks.createResponse();
      await userController.completeProfile(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('phoneNumber and groupId are required');
    });

  it('should create a user', async () => {
    (userService.createUser as jest.Mock).mockResolvedValue(mockUser);
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '0700000000',
      },
    });
    const res = httpMocks.createResponse();
    await userController.createUser(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(mockUser);
  });

  it('should return 400 if required fields are missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {},
    });
    const res = httpMocks.createResponse();
    await userController.createUser(req, res);
    expect(res.statusCode).toBe(400);
  });
  it('should update a user', async () => {
    (userService.updateUser as jest.Mock).mockResolvedValue({ ...mockUser, name: 'Updated User' });
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'test-id' },
      body: { name: 'Updated User' },
    });
    const res = httpMocks.createResponse();
    await userController.updateUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().name).toBe('Updated User');
  });

  it('should return 404 if user to update not found', async () => {
    (userService.updateUser as jest.Mock).mockResolvedValue(null);
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'not-found' },
      body: { name: 'Updated User' },
    });
    const res = httpMocks.createResponse();
    await userController.updateUser(req, res);
    expect(res.statusCode).toBe(404);
  });

  it('should delete a user', async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(true);
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: 'test-id' },
    });
    const res = httpMocks.createResponse();
    await userController.deleteUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().message).toBe('User deleted successfully');
  });

  it('should return 404 if user to delete not found', async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(false);
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: 'not-found' },
    });
    const res = httpMocks.createResponse();
    await userController.deleteUser(req, res);
    expect(res.statusCode).toBe(404);
  });

  it('should assign a group to a user', async () => {
    (userService.assignGroup as jest.Mock).mockResolvedValue({ ...mockUser, groupId: 'group-id' });
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'test-id' },
      body: { groupId: 'group-id' },
    });
    const res = httpMocks.createResponse();
    await userController.assigningGroup(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().groupId).toBe('group-id');
  });

  it('should return 404 if user to assign group not found', async () => {
    (userService.assignGroup as jest.Mock).mockResolvedValue(null);
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'not-found' },
      body: { groupId: 'group-id' },
    });
    const res = httpMocks.createResponse();
    await userController.assigningGroup(req, res);
    expect(res.statusCode).toBe(404);
  });
  it('should complete user profile', async () => {
    const updatedUser = { ...mockUser, phoneNumber: '0711111111', groupId: 'group-id' };
    const req = httpMocks.createRequest({
      method: 'PUT',
      body: { phoneNumber: '0711111111', groupId: 'group-id' },
      user: { id: 'test-id' },
    });
    const res = httpMocks.createResponse();
  jest.spyOn(require('../src/service/authService').default, 'completeProfile').mockResolvedValue(updatedUser);
    await userController.completeProfile(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().user.phoneNumber).toBe('0711111111');
    expect(res._getJSONData().user.groupId).toBe('group-id');
  });

  it('should return 400 if completeProfile missing fields', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      body: {},
      user: { id: 'test-id' },
    });
    const res = httpMocks.createResponse();
    await userController.completeProfile(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('should update user role', async () => {
    (userService.updateUser as jest.Mock).mockResolvedValue({ ...mockUser, role: 'admin' });
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'test-id' },
      body: { role: 'admin' },
    });
    const res = httpMocks.createResponse();
    await userController.updateUserRole(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().role).toBe('admin');
  });

  it('should return 400 if updateUserRole missing role', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'test-id' },
      body: {},
    });
    const res = httpMocks.createResponse();
    await userController.updateUserRole(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if updateUserRole user not found', async () => {
    (userService.updateUser as jest.Mock).mockResolvedValue(null);
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'not-found' },
      body: { role: 'admin' },
    });
    const res = httpMocks.createResponse();
    await userController.updateUserRole(req, res);
    expect(res.statusCode).toBe(404);
  });
  it('should return 500 if assigningGroup throws error', async () => {
    (userService.assignGroup as jest.Mock).mockImplementation(() => { throw new Error('DB error'); });
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'test-id' },
      body: { groupId: 'group-id' },
    });
    const res = httpMocks.createResponse();
    await userController.assigningGroup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('DB error');
  });

  it('should return 500 if updateUserRole throws error', async () => {
    (userService.updateUser as jest.Mock).mockImplementation(() => { throw new Error('Update error'); });
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'test-id' },
      body: { role: 'admin' },
    });
    const res = httpMocks.createResponse();
    await userController.updateUserRole(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Update error');
  });

  it('should return 500 if completeProfile throws error', async () => {
    jest.spyOn(require('../src/service/authService').default, 'completeProfile').mockImplementation(() => { throw new Error('Profile error'); });
    const req = httpMocks.createRequest({
      method: 'PUT',
      body: { phoneNumber: '0711111111', groupId: 'group-id' },
      user: { id: 'test-id' },
    });
    const res = httpMocks.createResponse();
    await userController.completeProfile(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Profile error');
  });

  it('should return 401 if loginGoogleCallback throws error', async () => {
    jest.spyOn(require('../src/service/authService').default, 'generateToken').mockImplementation(() => { throw new Error('Token error'); });
    const req = httpMocks.createRequest({
      method: 'GET',
      user: { id: 'test-id' },
    });
    const res = httpMocks.createResponse();
    await userController.loginGoogleCallback(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe('Token error');
  });
});
