const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateDatabaseConfig,
  deleteProject,
  deleteDatabase,
  saveWorkflow
} = require("../controllers/project.controller");

router.post("/create", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);

router.put("/:id", authMiddleware, updateProject);
router.put("/:projectId/workflow", authMiddleware, saveWorkflow);

router.delete("/:id", authMiddleware, deleteProject);
router.delete("/database/:dbId", authMiddleware, deleteDatabase);

module.exports = router;
