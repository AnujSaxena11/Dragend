import express from 'express';
import { downloadProject } from '../controllers/generator.controller.js';
import { llmBasedGeneration } from '../controllers/llmBasedGeneration.js';
import authMiddleware from "../middleware/authMiddleware.js";

const route = express.Router();

route.get('/:projectId/download', authMiddleware, downloadProject);

route.post('/:projectId/llm', authMiddleware, llmBasedGeneration)

export default route;