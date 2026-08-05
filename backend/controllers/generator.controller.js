import JSZip from "jszip";
import Project from "../models/Project.js";
import Database from "../models/Database.js";
import Table from "../models/Table.js";
import Endpoint from "../models/Endpoint.js";
import { generateDocs } from "./generators/docsGenerator.js";
import { generateExpressProject } from "./generators/expressGenerator.js";
import { generateFastApiProject } from "./generators/fastapiGenerator.js";
import { generateSpringBootProject } from "./generators/springBootGenerator.js";
import { generateDjangoProject } from "./generators/djangoGenerator.js";
import { generateFlaskProject } from "./generators/flaskGenerator.js";

export async function downloadProject(req, res) {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        const database = await Database.findOne({ projectId: project._id }).populate('config');
        const dbType = database ? database.type : 'mongodb';
        const dbConfig = database ? database.config : null;
        const dbName = database ? database.name : 'myapp';

        const tables = await Table.find({ projectId });
        const endpoints = await Endpoint.find({ projectId });

        const groupedEndpoints = {};
        const tableIdToName = {};

        tables.forEach(t => tableIdToName[t._id.toString()] = t.name);

        endpoints.forEach(ep => {
            let tableName = 'General';
            if (ep.connectedTableId && tableIdToName[ep.connectedTableId.toString()]) {
                tableName = tableIdToName[ep.connectedTableId.toString()];
            }
            if (!groupedEndpoints[tableName]) groupedEndpoints[tableName] = [];
            groupedEndpoints[tableName].push(ep);
        });

        const zip = new JSZip();

        const stack = (project.backendStack || 'express').toLowerCase().replace(/\s+/g, '');

        const generationData = {
            project, dbType, dbConfig, dbName, tables, endpoints, groupedEndpoints
        };

        if (stack === 'fastapi') {
            generateFastApiProject(zip, generationData);
        } else if (stack === 'spring' || stack === 'springboot' || stack === 'java') {
            generateSpringBootProject(zip, generationData);
        } else if (stack === 'django' || stack === 'python-django') {
            generateDjangoProject(zip, generationData);
        } else if (stack === 'flask' || stack === 'python-flask') {
            generateFlaskProject(zip, generationData);
        } else {
            generateExpressProject(zip, generationData);
        }

        generateDocs(zip, generationData, stack);

        const content = await zip.generateAsync({ type: "nodebuffer" });
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename=${project.name.replace(/\s+/g, '_')}_${stack}.zip`,
            'Content-Length': content.length
        });
        return res.send(content);

    } catch (err) {
        console.error("Generator Error:", err);
        return res.status(500).json({ msg: "Failed to generate project" });
    }
};
