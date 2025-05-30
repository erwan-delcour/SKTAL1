


import { getActualParkingStats, getSpotsStatus } from '../controllers/statsController';
import { Request, Response } from 'express';
import {
  getReservationFromTodayFromDB,
  getTodayFreeChargerSpotsCountFromDB,
  getTodayFreeSpotsCountFromDB,
  getAllPlacesStatusFromDB
} from '../models/statsModel';

jest.mock('../models/statsModel', () => ({
  getReservationFromTodayFromDB: jest.fn(),
  getTodayFreeChargerSpotsCountFromDB: jest.fn(),
  getTodayFreeSpotsCountFromDB: jest.fn(),
  getAllPlacesStatusFromDB: jest.fn()
}));

describe('Stats Controller', () => {
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

  describe('getActualParkingStats', () => {
    it('should return 200 with stats', async () => {
      (getReservationFromTodayFromDB as jest.Mock).mockResolvedValue(5);
      (getTodayFreeSpotsCountFromDB as jest.Mock).mockResolvedValue(10);
      (getTodayFreeChargerSpotsCountFromDB as jest.Mock).mockResolvedValue(2);

      await getActualParkingStats(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        totalReservationsToday: 5,
        totalFreeSpotsToday: 10,
        totalFreeChargerSpotsToday: 2
      });
    });

    it('should return 500 on error', async () => {
      (getReservationFromTodayFromDB as jest.Mock).mockRejectedValue(new Error('DB error'));

      await getActualParkingStats(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getSpotsStatus', () => {
    it('should return 200 with spot statuses', async () => {
      const mockSpots = [{ id: 1, status: 'free' }, { id: 2, status: 'reserved' }];
      (getAllPlacesStatusFromDB as jest.Mock).mockResolvedValue(mockSpots);

      await getSpotsStatus(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockSpots);
    });

    it('should return 500 on error', async () => {
      (getAllPlacesStatusFromDB as jest.Mock).mockRejectedValue(new Error('Something failed'));

      await getSpotsStatus(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Something failed' });
    });
  });
});