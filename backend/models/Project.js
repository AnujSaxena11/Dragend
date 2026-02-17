const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  databaseIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Database"
    }
  ],
  canvasState: {
    nodes: { type: Array, default: [] },
    edges: { type: Array, default: [] },
  },
  agentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);