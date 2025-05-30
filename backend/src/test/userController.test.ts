


import { getUsers } from '../controllers/userController';
import { Request, Response } from 'express';
import { getAllUsers } from '../models/userModel';

jest.mock('../models/userModel', () => ({
  getAllUsers: jest.fn()
}));

describe('User Controller - getUsers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return 200 with list of users', async () => {
    const fakeUsers = [
      { id: '1', email: 'test1@mail.com', login: 'test1' },
      { id: '2', email: 'test2@mail.com', login: 'test2' }
    ];
    (getAllUsers as jest.Mock).mockResolvedValue(fakeUsers);

    await getUsers(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(fakeUsers);
  });

  it('should return 500 if an error occurs', async () => {
    (getAllUsers as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getUsers(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});