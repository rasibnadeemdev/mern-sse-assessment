// Todo: Implement the User Service Logic to be used in the Resolver - Following MVR Model (Model View Resolver)
import { Error } from "mongoose";
import bcrypt from "bcryptjs";

import User from "./user.schema";
import { IUser } from "./user.schema";

class UserService {
  static async findAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  static async getUser(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error("User not found");
    }
  }

  static async updateUser(
    userId: string,
    updates: Partial<Pick<IUser, "email" | "username" | "password" | "role">>
  ): Promise<IUser | null> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
      }

      if (updates.password) {
        const saltRounds = 10;
        updates.password = await bcrypt.hash(updates.password, saltRounds);
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      });

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  static async deleteUser(userId: string): Promise<IUser | null> {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error("Failed to fetch user by email");
    }
  }
  static async createUser(userData: {
    email: string;
    username: string;
    password: string;
    role: string;
    isAdmin: boolean;
  }): Promise<IUser> {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }
}

export default UserService;
