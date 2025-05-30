import { getReservations, requestReservation } from "../controllers/reservationController";
import * as reservationModel from "../models/reservationModel";
import * as userModel from "../models/userModel";

jest.mock("../models/reservationModel");
jest.mock("../models/userModel");

describe("Reservation Controller (unit)", () => {
  const mockSecretary = { id: "1", role: "secretary" };
  const mockUser = { id: "2", role: "user" };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getReservations", () => {
    it("should return 403 if user not found", async () => {
      const req = { body: { userId: "1" } } as any;
      const res = mockResponse();
      (userModel.getUserById as jest.Mock).mockResolvedValue(null);
      await getReservations(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 403 if user is not secretary", async () => {
      const req = { body: { userId: "2" } } as any;
      const res = mockResponse();
      (userModel.getUserById as jest.Mock).mockResolvedValue(mockUser);
      await getReservations(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    });

    it("should return 200 with reservations", async () => {
      const req = { body: { userId: "1" } } as any;
      const res = mockResponse();
      (userModel.getUserById as jest.Mock).mockResolvedValue(mockSecretary);
      (reservationModel.getReservationsFromDB as jest.Mock).mockResolvedValue([{ id: "res1" }]);
      await getReservations(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: "res1" }]);
    });
  });

  describe("requestReservation", () => {
    it("should return 400 if fields missing", async () => {
      const req = { body: { userId: "1" } } as any;
      const res = mockResponse();
      await requestReservation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          userId: "1",
          startDate: "2024-01-01",
          endDate: "2024-01-02"
        }
      } as any;
      const res = mockResponse();
      (userModel.getUserById as jest.Mock).mockResolvedValue(null);
      await requestReservation(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 201 if reservation is created", async () => {
      const req = {
        body: {
          userId: "2",
          startDate: "2024-01-01",
          endDate: "2024-01-02"
        }
      } as any;
      const res = mockResponse();
      (userModel.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (reservationModel.createPendingReservationInDB as jest.Mock).mockResolvedValue({ id: "newRes" });
      await requestReservation(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "newRes" });
    });
  });
});