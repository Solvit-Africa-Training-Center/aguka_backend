import AuthService from '../src/services/authService';

const userMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
};
jest.mock('../src/database/models/user', () => {
  const userMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  };
  return {
    User: userMock,
    UserModel: jest.fn(() => userMock),
  };
});

jest.mock('../src/database/models/group', () => ({
  GroupModel: jest.fn(() => ({
    findByPk: jest.fn(),
  })),
}));

describe('AuthService', () => {
  it('should throw error if identifier or password missing', async () => {
    await expect(AuthService.loginLocal('', '')).rejects.toThrow(
      'Identifier and password required',
    );
  });

  it('should throw error if user not found', async () => {
    require('../src/database/models/user').User.findOne.mockResolvedValue(null);
    await expect(AuthService.loginLocal('notfound@example.com', 'pass')).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('should throw error if group not found in completeProfile', async () => {
    const mockUser = { id: 'test-id', save: jest.fn() };
    require('../src/database/models/group').GroupModel().findByPk.mockResolvedValue(null);
    require('../src/database/models/user').User.findByPk.mockResolvedValue(mockUser);
    await expect(
      AuthService.completeProfile('test-id', { phoneNumber: '0700000000', groupId: 'notfound' }),
    ).rejects.toThrow('Invalid groupId: group not found');
  });
});
