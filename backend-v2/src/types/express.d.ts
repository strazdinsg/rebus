// types/express.d.ts
import { Request } from "express";

// Declare the sessionUser property on the Request interface for Express
// We will use this to store the current user in the session
declare module "express" {
  interface Request {
    /**
     * The current user ID in the session.
     */
    sessionUserId?: number;
    /**
     * Whether the current user is an admin.
     */
    sessionUserIsAdmin?: boolean;
  }
}
