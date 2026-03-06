import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number; // optional because not always present
  }
}
