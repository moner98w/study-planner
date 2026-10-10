import { Router } from "express";
import { db } from "../config/db";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);
router.get("/", async (_req, res) => {
  try {
    const userId = res.locals.user.userId;

    const [subjects] = await db.query(
      "SELECT id, name, color, created_at FROM subjects WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get subjects",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const { name, color = "#6366F1" } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const userId = res.locals.user.userId;

    await db.query(
      "INSERT INTO subjects (user_id, name, color) VALUES (?, ?, ?)",
      [userId, name.trim(), color]
    );

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subject",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const subjectId = req.params.id;

    await db.query(
      "DELETE FROM subjects WHERE id = ? AND user_id = ?",
      [subjectId, userId]
    );

    return res.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subject",
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const subjectId = req.params.id;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    await db.query(
      "UPDATE subjects SET name = ?, color = ? WHERE id = ? AND user_id = ?",
      [name, color || "#6366F1", subjectId, userId]
    );

    return res.json({
      success: true,
      message: "Subject updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subject",
    });
  }
});
export default router;