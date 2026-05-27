import { checkAccountStatus } from "./checkAccountStatus.js";
import { rolesAllowed } from "./roleBased.js";
import { verifyToken } from "./verifyAuth.js";

export const requireAuth = [verifyToken, checkAccountStatus];

export const requireRoles = (...roles) => [
  ...requireAuth,
  rolesAllowed(...roles),
];

export const requireAdmin = requireRoles("admin");
export const requireOrganizer = requireRoles("organizer", "admin");
