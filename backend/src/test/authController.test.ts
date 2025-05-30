

import { signUp, signIn } from '../controllers/authController';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/dbConfig';
import { getUserByLogin } from '../models/userModel';

jest.mock('../db/dbConfig', () => ({
  query: jest.fn()
}));
jest.mock('../models/userModel', () => ({
  getUserByLogin: jest.fn()
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should return 400 if body is missing', async () => {
      mockReq.body = null;
      await signUp(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { email: '', login: '', password: '' };
      await signUp(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 409 if user already exists', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });
      mockReq.body = { email: 'test@mail.com', login: 'test', password: '123456' };
      await signUp(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(409);
    });

    it('should return 201 if user is created successfully', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPwd');
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      mockReq.body = { email: 'test@mail.com', login: 'test', password: '123456' };
      await signUp(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 if an error occurs', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB error'));
      mockReq.body = { email: 'test@mail.com', login: 'test', password: '123456' };
      await signUp(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('signIn', () => {
    it('should return 400 if body is missing', async () => {
      mockReq.body = null;
      await signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if login or password is missing', async () => {
      mockReq.body = { login: '', password: '' };
      await signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 if user does not exist', async () => {
      (getUserByLogin as jest.Mock).mockResolvedValue(null);
      mockReq.body = { login: 'test', password: '123' };
      await signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if password is incorrect', async () => {
      (getUserByLogin as jest.Mock).mockResolvedValue({ password: 'hashedPwd' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      mockReq.body = { login: 'test', password: 'wrongPwd' };
      await signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 200 and token if login is successful', async () => {
      (getUserByLogin as jest.Mock).mockResolvedValue({ id: '1', role: 'user', password: 'hashedPwd' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      mockReq.body = { login: 'test', password: '123' };
      await signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return 500 if an error occurs', async () => {
      (getUserByLogin as jest.Mock).mockRejectedValue(new Error('Something went wrong'));
      mockReq.body = { login: 'test', password: '123' };
      await signIn(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});