import mongoose from 'mongoose';

const LlmHistorySchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        index: true
    },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'] },
        content: { type: String, required: true }
    }],
    updatedAt: { type: Date, default: Date.now }
});

export const LlmHistory = mongoose.model('llmhistory', LlmHistorySchema);