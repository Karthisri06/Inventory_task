import { Request, Response } from "express";
import * as userController from "../controllers/auth.controller";
import * as authService from "../services/auth.service";

jest.mock("../services/auth.service");

describe("User Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRequest = {};
        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };
    });

    describe("Register", () => {
        it("should register a user and return success response", async () => {
            const mockUserData = {
                name: "test",
                email: "test@example.com",
                password: "password123",
                store: "StoreA",
                role: "user",
            };

            const mockUser = {
                id: 1,
                ...mockUserData,
                password: "hashedpassword",
            };

            mockRequest.body = mockUserData;

            (authService.UserRegister as jest.Mock).mockResolvedValue(mockUser);

            await userController.Register(mockRequest as Request, mockResponse as Response);

            expect(authService.UserRegister).toHaveBeenCalledWith(
                mockUserData.name,
                mockUserData.email,
                mockUserData.password,
                mockUserData.store,
                mockUserData.role
            );
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "User registered successfully",
                data: mockUser,
            });
        });

        it("should handle errors during registration", async () => {
            const error = new Error("Registration failed");
            mockRequest.body = {
                name: "Error",
                email: "error@example.com",
                password: "pass",
                store: "store",
                role: "user",
            };

            (authService.UserRegister as jest.Mock).mockRejectedValue(error);

            await userController.Register(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Registration failed",
                error: "Registration failed",
            });
        });
    });
});
