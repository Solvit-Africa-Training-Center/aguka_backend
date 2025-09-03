import userService from '../src/service/userService';

jest.mock('../src/database/models/user', () => ({
  User: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('UserService', () => {
  it('should create a user', async () => {
    const mockUser = { id: 'test-id', name: 'Test', email: 'test@example.com', phoneNumber: '0700000000', role: 'user', groupId: null };
    require('../src/database/models/user').User.create.mockResolvedValue(mockUser);
    const result = await userService.createUser({ name: 'Test', email: 'test@example.com', password: 'pass', phoneNumber: '0700000000', role: 'user' });
    expect(result).toEqual(mockUser);
  });

  it('should get all users', async () => {
    require('../src/database/models/user').User.findAll.mockResolvedValue([{}]);
    const result = await userService.getAllUsers();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return null if user not found by id', async () => {
    require('../src/database/models/user').User.findByPk.mockResolvedValue(null);
    const result = await userService.getUserById('not-found');
    expect(result).toBeNull();
  });
  it('should update a user', async () => {
    const mockUser = { id: 'test-id', name: 'Updated', email: 'test@example.com', phoneNumber: '0700000000', role: 'user', groupId: null, update: jest.fn().mockResolvedValue(true) };
    require('../src/database/models/user').User.findByPk.mockResolvedValue(mockUser);
    mockUser.update.mockResolvedValue(mockUser);
    const result = await userService.updateUser('test-id', { name: 'Updated' });
    expect(result).toEqual(mockUser);
  });

  it('should return null when updating a non-existent user', async () => {
    require('../src/database/models/user').User.findByPk.mockResolvedValue(null);
    const result = await userService.updateUser('not-found', { name: 'Updated' });
    expect(result).toBeNull();
  });

  it('should delete a user', async () => {
    const mockUser = { destroy: jest.fn().mockResolvedValue(true) };
    require('../src/database/models/user').User.findByPk.mockResolvedValue(mockUser);
    const result = await userService.deleteUser('test-id');
    expect(result).toBe(true);
  });

  it('should return null when deleting a non-existent user', async () => {
    require('../src/database/models/user').User.findByPk.mockResolvedValue(null);
    const result = await userService.deleteUser('not-found');
    expect(result).toBeNull();
  });

  it('should assign a group to a user', async () => {
    const mockUser = { update: jest.fn(), groupId: null };
    require('../src/database/models/user').User.findByPk.mockResolvedValue(mockUser);
    mockUser.update.mockImplementation((data) => {
      mockUser.groupId = data.groupId;
      return Promise.resolve(mockUser);
    });
    const result = await userService.assignGroup('test-id', 'group-id');
    expect(result && result.groupId).toBe('group-id');
  });

  it('should return null when assigning a group to a non-existent user', async () => {
    require('../src/database/models/user').User.findByPk.mockResolvedValue(null);
    const result = await userService.assignGroup('not-found', 'group-id');
    expect(result).toBeNull();
  });
  it('should handle invalid role in updateUser', async () => {
    const mockUser = { update: jest.fn().mockResolvedValue(true) };
    require('../src/database/models/user').User.findByPk.mockResolvedValue(mockUser);
    const result = await userService.updateUser('test-id', { role: 'invalid' });
    expect(result).toEqual(mockUser);
  });

  it('should throw error if login credentials are invalid', async () => {
    require('../src/database/models/user').User.findOne.mockResolvedValue(null);
    await expect(userService.login('bad@example.com', '', 'wrong')).rejects.toThrow('Invalid email or password');
  });

  it('should throw error if JWT_SECRET is missing in login', async () => {
    require('../src/database/models/user').User.findOne.mockResolvedValue({
      id: 'test-id',
      role: 'user',
      email: 'test@example.com',
      password: await require('bcrypt').hash('pass', 10),
    });
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = '';
    await expect(userService.login('test@example.com', '', 'pass')).rejects.toThrow('JWT_SECRET environment variable is not defined');
    process.env.JWT_SECRET = originalSecret;
  });
});
