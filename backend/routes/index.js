import express from 'express';
const route = express.Router();
import authRoute from './auth.js';
import projectRoute from './project.js';
import generateRoute from './generateProject.js';

route.use('/auth', authRoute);
route.use('/project', projectRoute);
route.use('/project/generate', generateRoute);

export default route;