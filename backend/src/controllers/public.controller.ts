import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPublicHomeData(req: Request, res: Response) {
  try {
    const [courses, allFaculty, notifications, banners, gallery, results, posters] = await Promise.all([
      // 1. Courses
      prisma.course.findMany({
        where: { isActive: true },
        include: { _count: { select: { batches: true } } },
        orderBy: { createdAt: "desc" },
      }),
      
      // 2. Faculty
      prisma.faculty.findMany({ include: { photo: true }, orderBy: { createdAt: "asc" } }),

      // 3. Notifications
      prisma.notification.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),

      // 4. Banners
      prisma.asset.findMany({ where: { type: "BANNER" }, take: 5 }),

      // 5. Gallery
      prisma.asset.findMany({ where: { type: "GALLERY" }, take: 10, orderBy: { createdAt: "desc" } }),

      // 6. Results
      prisma.asset.findMany({ where: { type: "RESULT" }, take: 10, orderBy: { createdAt: "desc" } }),

      // 7. ✅ FIX FOR ARROWS: Fetch MULTIPLE posters (Top 5), not just findFirst
      prisma.asset.findMany({ 
        where: { type: "POSTER" }, 
        orderBy: { createdAt: "desc" },
        take: 5 
      }),
    ]);

    // ✅ Inject ALL Posters into Notifications
    const formattedPosters = posters.map(p => ({
      id: p.id,
      message: p.title || "Announcement",
      link: p.fileUrl,
      type: "POSTER",
      isActive: true,
      createdAt: p.createdAt
    }));

    // Merge: Posters First
    const finalNotifications = [...formattedPosters, ...notifications];

    const leadership = allFaculty.filter(f => f.category === "LEADERSHIP");
    const teachingFaculty = allFaculty.filter(f => f.category === "TEACHING");

    res.json({
      success: true,
      data: { courses, faculty: teachingFaculty, leadership, notifications: finalNotifications, banners, gallery, results },
    });
  } catch (error) {
    console.error("Public Data Error:", error);
    res.status(500).json({ message: "Failed to load homepage data" });
  }
}