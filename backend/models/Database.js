const mongoose = require('mongoose');
const Project = require('./Project');

const databaseSchema = new mongoose.Schema({
    projectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    type: {
      type: String,
      enum: ["postgresql", "mysql", "mongodb", "sqlserver", "oracle"],
      required: true
    },
    config : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "DB_Config",
        required : true
    }

}, {
    timestamps :true
});

module.exports = mongoose.model('Database', databaseSchema);