import bcrypt from "bcryptjs";

import JwtService from "../services/jwt.service";
import UserService from "../users/users.service";
import { IUser } from "../users/user.schema";

class AuthService {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = JwtService.getInstance();
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await UserService.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const authService = JwtService.getInstance();
    const token = authService.sign({ id: user.id, role: user.role }, "1d");

    let userToReturn = { ...user.toObject() };

    delete userToReturn.password;

    return { user: userToReturn, token };
  }

  async signUp(
    email: string,
    username: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserService.createUser({
      email,
      username,
      password: hashedPassword,
      isAdmin: false,
      role: "buyer",
    });

    const authService = JwtService.getInstance();
    const token = authService.sign({ id: newUser.id, role: "buyer" }, "1d");

    let userToReturn = { ...newUser.toObject() };

    delete userToReturn.password;

    return { user: userToReturn, token };
  }
  async switchRole(token: string): Promise<{ user: IUser; token: string }> {
    const authService = JwtService.getInstance();

    const decoded: any = authService.verify(token);

    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

    const newRole = decoded.role === "buyer" ? "seller" : "buyer";

    const updatedUser = await UserService.updateUser(decoded.id, {
      role: newRole,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user role");
    }

    let userToReturn = { ...updatedUser.toObject() };

    delete userToReturn.password;

    const newToken = authService.sign(
      { id: updatedUser.id, role: newRole },
      "1d"
    );

    return { user: userToReturn, token: newToken };
  }
}

export default new AuthService();
