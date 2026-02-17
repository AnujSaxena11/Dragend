const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  constraint: { type: String, enum: ['primary', 'foreign', 'unique', 'none'], default: 'none',
    set: (v) => (v === '' || v === null) ? 'none' : v
  },
  required: { type: Boolean, default: false }
}, { _id: false });

const tableSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  databaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Database", required: true },
  name: { type: String, required: true },
  fields: [fieldSchema]
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);