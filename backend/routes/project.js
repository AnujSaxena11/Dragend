import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteDatabase,
  saveWorkflow
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);

router.route('/:id')
  .patch(authMiddleware, updateProject)
  .get(authMiddleware, getProjectById)
  .delete(authMiddleware, deleteProject)

router.put("/:projectId/workflow", authMiddleware, saveWorkflow);
router.delete("/database/:dbId", authMiddleware, deleteDatabase);

export default router;
