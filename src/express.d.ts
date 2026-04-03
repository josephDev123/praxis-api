import "express"; // This turns the file into a module (required for augmentation to work reliably)

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      name: string;
    };
  }
}
