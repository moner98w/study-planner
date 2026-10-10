import { Router } from "express";
import { db } from "../config/db";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);
router.get("/", async (_req, res) => {
  try {
    const userId = res.locals.user.userId;

    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE user_id = ?",
      [userId]
    );
    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get tasks",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const { subjectId, title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    await db.query(
      `INSERT INTO tasks
      (user_id, subject_id, title, description, due_date, priority)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        subjectId || null,
        title,
        description || null,
        dueDate || null,
        priority || "medium",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const taskId = req.params.id;
    const { subjectId, title, description, dueDate, priority, status } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    await db.query(
      `UPDATE tasks
       SET subject_id = ?, title = ?, description = ?,
           due_date = ?, priority = ?, status = ?
       WHERE id = ? AND user_id = ?`,
      [
        subjectId || null,
        title,
        description || null,
        dueDate || null,
        priority || "medium",
        status || "pending",
        taskId,
        userId,
      ]
    );

    return res.json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const taskId = req.params.id;

    await db.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    return res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});
export default router;