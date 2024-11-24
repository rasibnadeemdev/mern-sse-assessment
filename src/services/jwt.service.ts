import jwt, { JwtPayload } from "jsonwebtoken";

class JwtService {
  private static instance: JwtService;
  private readonly SECRET_KEY: string;

  private constructor() {
    this.SECRET_KEY = process.env.SECRET_KEY || "default-secret";
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  public sign(payload: object, expiresIn?: string | number): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn });
  }

  public verify(token: string): string | JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY);

      if (decoded) {
        return decoded as JwtPayload;
      }

      return null;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  public decode(token: string): string | JwtPayload | null {
    return jwt.decode(token);
  }
}

export default JwtService;
