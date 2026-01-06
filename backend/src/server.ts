import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
import cookieParser from "cookie-parser";
import { pageVisitMiddleware } from "./middleware/pageVisit.middleware";

// ✅ Import your routes
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes"; 
import publicRoutes from "./routes/public.routes";
import path from "path";


dotenv.config();

const app = express();

// ✅ Configure CORS to allow cookies from Frontend (Port 3000)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ];

    // Allow all Cloudflare tunnel subdomains
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".trycloudflare.com")
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());

// ✅ CRITICAL: You must enable the cookie parser
app.use(cookieParser());

app.use(pageVisitMiddleware);

// ✅ MOUNT THE ROUTES
// This means "http://localhost:4000/admin/login" will now work
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/public", publicRoutes);

app.get("/", (_req, res) => {
  res.send("Backend running 🚀");
});

prisma.$connect()
  .then(() => console.log("Prisma connected ✅"))
  .catch(console.error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
