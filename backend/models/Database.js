import mongoose from 'mongoose';
import Project from './Project.js';

const databaseSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['postgresql', 'mysql', 'mongodb', 'sqlserver', 'oracle'],
      required: true,
    },
    config: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DB_Config',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Database = mongoose.model('Database', databaseSchema);

export default Database;