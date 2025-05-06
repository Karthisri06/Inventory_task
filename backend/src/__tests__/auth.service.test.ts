import { UserRegister } from "../services/auth.service";
import { AppDataSource } from "../datasource";
import bcrypt from "bcrypt";
import { User } from "../entities/user";

// Mock dependencies
jest.mock("bcrypt");
jest.mock("../datasource");

describe("UserRegister", () => {
  let saveMock: jest.Mock;
  let createMock: jest.Mock;

  beforeAll(() => {
    // Mock AppDataSource.getRepository to return a mock repository with mocked methods
    createMock = jest.fn().mockReturnValue({});  // Mock create method
    saveMock = jest.fn().mockResolvedValue({});   // Mock save method

    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      create: createMock,
      save: saveMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should hash the password and create a user", async () => {
    const mockUserData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      store: "Store A",
      role: "user",
    };

    const mockHashedPassword = "hashedpassword123";

    // Mock bcrypt.hash to return the hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    // Call the UserRegister function
    await UserRegister(
      mockUserData.name,
      mockUserData.email,
      mockUserData.password,
      mockUserData.store,
      mockUserData.role
    );

    // Verify bcrypt.hash is called with correct arguments
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);

    // Ensure create is called with the expected user data
    expect(createMock).toHaveBeenCalledWith({
      ...mockUserData,
      password: mockHashedPassword,
    });

    // Ensure save method is called
    expect(saveMock).toHaveBeenCalled();
  });

  it("should throw an error if saving the user fails", async () => {
    const mockUserData = {
      name: "Error User",
      email: "error@example.com",
      password: "password123",
      store: "Store B",
      role: "admin",
    };

    const mockHashedPassword = "hashedpassword123";

 
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

 
    saveMock.mockRejectedValue(new Error("Database error"));


    await expect(
      UserRegister(
        mockUserData.name,
        mockUserData.email,
        mockUserData.password,
        mockUserData.store,
        mockUserData.role
      )
    ).rejects.toThrow("Database error");

 
    expect(saveMock).toHaveBeenCalled();
  });
});
