import { NextFunction, Request, Response } from "express";

import JwtService from "../../services/jwt.service";
import UserService from "../../users/users.service";

export const authenticateUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req?.headers?.["authorization"]?.split(" ")?.[1];

  if (token) {
    const instance = JwtService.getInstance();

    let user: any = instance.verify(token);
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      user = await UserService.getUser(user.id);
      if (!user) {
        res.status(401).json({ message: "Account not found" });
      }

      //   @ts-ignore
      req.user = user;
    }
    next();
  }
};
