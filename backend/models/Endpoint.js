const mongoose = require('mongoose');

const endpointSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  method: { 
    type: String, 
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  },
  route: { type: String, required: true }, 
  connectedTableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  selectedFields: [{ type: String }] 
}, { timestamps: true });

module.exports = mongoose.model('Endpoint', endpointSchema);