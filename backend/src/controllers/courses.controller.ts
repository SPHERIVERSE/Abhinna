import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function createCourse(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        isActive: true, // Default to active
      },
    });

    res.json({ success: true, course });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    // Fetch courses AND include the count of batches inside them
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { batches: true } // Useful for showing "3 Batches" on the UI
        }
      }
    });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
}

// ✅ UPDATE COURSE
export async function updateCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: { title, description, isActive },
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
}

// ✅ DELETE COURSE
export async function deleteCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Optional: Check if course has batches before deleting to prevent data loss
    // const batches = await prisma.batch.count({ where: { courseId: id } });
    // if (batches > 0) return res.status(400).json({ message: "Cannot delete course with active batches" });

    await prisma.course.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
}


// Optional: Toggle Active Status
export async function toggleCourseStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: { isActive },
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
}
