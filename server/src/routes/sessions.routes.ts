import { Router } from "express";
import { db } from "../config/db";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);
router.get("/", async (_req, res) => {
  try {
    const userId = res.locals.user.userId;

    const [sessions] = await db.query(
      "SELECT * FROM study_sessions WHERE user_id = ?",
      [userId]
    );

    return res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get study sessions",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const {
      subjectId,
      title,
      sessionDate,
      startTime,
      durationMinutes,
      notes,
    } = req.body;

    if (!title || !sessionDate || !durationMinutes) {
      return res.status(400).json({
        success: false,
        message: "Title, session date and duration are required",
      });
    }

    await db.query(
      `INSERT INTO study_sessions
       (user_id, subject_id, title, session_date,
        start_time, duration_minutes, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        subjectId || null,
        title,
        sessionDate,
        startTime || null,
        durationMinutes,
        notes || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Study session created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create study session",
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const sessionId = req.params.id;

    const {
      subjectId,
      title,
      sessionDate,
      startTime,
      durationMinutes,
      notes,
      completed,
    } = req.body;

    await db.query(
      `UPDATE study_sessions
       SET subject_id = ?, title = ?, session_date = ?,
           start_time = ?, duration_minutes = ?, notes = ?,
           completed = ?
       WHERE id = ? AND user_id = ?`,
      [
        subjectId || null,
        title,
        sessionDate,
        startTime || null,
        durationMinutes,
        notes || null,
        completed ?? false,
        sessionId,
        userId,
      ]
    );

    return res.json({
      success: true,
      message: "Study session updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update study session",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const sessionId = req.params.id;

    await db.query(
      "DELETE FROM study_sessions WHERE id = ? AND user_id = ?",
      [sessionId, userId]
    );

    return res.json({
      success: true,
      message: "Study session deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete study session",
    });
  }
});
export default router;