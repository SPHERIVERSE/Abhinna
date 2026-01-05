import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// ✅ CREATE BATCH
export async function createBatch(req: Request, res: Response) {
  try {
    const { name, courseId, startDate, endDate } = req.body;

    if (!name || !courseId || !startDate) {
      return res.status(400).json({ message: "Name, Course, and Start Date are required" });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        courseId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
    });

    res.json({ success: true, batch });
  } catch (error) {
    console.error("Create Batch Error:", error);
    res.status(500).json({ message: "Failed to create batch" });
  }
}

// ✅ GET BATCHES
export async function getBatches(req: Request, res: Response) {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { startDate: "desc" },
      include: {
        course: {
          select: { title: true } // Include Course Name for display
        }
      }
    });
    res.json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batches" });
  }
}

// ✅ UPDATE BATCH
export async function updateBatch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, isActive } = req.body;

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive
      },
      include: { course: { select: { title: true } } }
    });

    res.json({ success: true, batch });
  } catch (error) {
    res.status(500).json({ message: "Failed to update batch" });
  }
}

// ✅ DELETE BATCH
export async function deleteBatch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.batch.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete batch" });
  }
}