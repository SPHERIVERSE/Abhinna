import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AssetType } from "@prisma/client";

export async function createAsset(req: Request, res: Response) {
  try {
    const { title, type, url } = req.body;
    const adminId = (req as any).user?.sub;

    if (!title || !url || !type || !adminId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const asset = await prisma.asset.create({
      data: {
        title: title,
        type: type as AssetType,
        fileUrl: url,
        mimeType: "image/jpeg", 
        size: 0,
        admin: {
          connect: { id: adminId }
        }
        // Description is optional, can add if your schema has it
      },
    });

    res.json({ success: true, asset });
  } catch (error) {
    console.error("Create Asset Error:", error);
    res.status(500).json({ message: "Failed to save asset" });
  }
}

export async function getAssets(req: Request, res: Response) {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assets" });
  }
}

// ✅ UPDATE ASSET
export async function updateAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, type } = req.body;

    const updated = await prisma.asset.update({
      where: { id },
      data: { title, type },
    });

    res.json({ success: true, asset: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
}

// ✅ DELETE ASSET
export async function deleteAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Note: In a production app, you would also trigger a delete 
    // to your Cloud Storage (S3/Cloudinary) here using the fileUrl.
    
    await prisma.asset.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
}
