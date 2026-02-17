const express = require('express');
const route = express.Router();
const { downloadProject } = require('../controllers/generator.controller');

route.get('/:projectId/download', downloadProject);

module.exports = route;