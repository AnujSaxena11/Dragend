const express = require('express');
const route = express.Router();
const authRoute = require('./auth');
const projectRoute = require('./project');
const generateRoute = require('./generateProject');

route.use('/auth',authRoute);
route.use('/project',projectRoute);
route.use('/project/generate',generateRoute);

module.exports = route;