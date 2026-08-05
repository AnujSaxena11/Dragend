import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    isArray: { type: Boolean, default: false },

    constraint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    unique: { type: Boolean, default: false },
    index: { type: Boolean, default: false },

    defaultValue: { type: mongoose.Schema.Types.Mixed, default: '' },
    autoIncrement: { type: Boolean, default: false },
    isUuid: { type: Boolean, default: false },

    minLength: { type: String, default: '' },
    maxLength: { type: String, default: '' },
    regexPattern: { type: String, default: '' },
    minValue: { type: String, default: '' },
    maxValue: { type: String, default: '' },
    enumValues: { type: String, default: '' },

    targetTable: { type: String, default: '' },
    targetField: { type: String, default: '' },
    onDelete: { type: String, default: 'Cascade' },
    onUpdate: { type: String, default: 'Cascade' },

    isHidden: { type: Boolean, default: false },
    isHashed: { type: Boolean, default: false },
    hashAlgorithm: { type: String, default: 'bcrypt' },
});

const TableSchema = new mongoose.Schema(
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
        timestamps: {
            type: Boolean,
            default: false,
        },
        fields: [FieldSchema],
    },
    { timestamps: true }
);

export default mongoose.model('Table', TableSchema);