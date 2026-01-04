import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

const IGNORED_PATHS = [
  "/admin",
  "/auth",
  "/favicon.ico",
  "/assets",
  "/uploads"
];

export async function pageVisitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (
      req.method !== "GET" ||
      IGNORED_PATHS.some((p) => req.path.startsWith(p))
    ) {
      return next();
    }

    await prisma.pageVisit.create({
      data: {
        path: req.path,
        ipAddress: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.get("user-agent") || "unknown",
      }
    });
  } catch (err) {
    // silently fail — never block user
    console.error("PageVisit error:", err);
  }

  next();
}

