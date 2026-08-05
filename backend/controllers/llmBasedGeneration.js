import { generateWithQwen, generateWithLlamaScout, generateWithLlama70B, generateWithGemini } from './LLmBased/llmModels.js';
import { LlmHistory } from '../models/LlmHistory.js';

const MAX_HISTORY_LENGTH = 4;

export async function llmBasedGeneration(req, res) {
    const { prompt, model, projectId } = req.body;

    if (!prompt || !model || !projectId) {
        return res.status(400).json({ success: false, msg: "Prompt, model, and projectId are required." });
    }

    try {
        let historyDoc = await LlmHistory.findOne({ projectId });
        let pastMessages = historyDoc ? historyDoc.messages : [];

        if (pastMessages.length > MAX_HISTORY_LENGTH) {
            pastMessages = pastMessages.slice(-MAX_HISTORY_LENGTH);
        }

        const contextMessages = pastMessages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        let schemaData;

        switch (model.toLowerCase()) {
            case 'qwen':
                schemaData = await generateWithQwen(contextMessages, prompt);
                break;
            case 'scout':
                schemaData = await generateWithLlamaScout(contextMessages, prompt);
                break;
            case 'llama70b':
                schemaData = await generateWithLlama70B(contextMessages, prompt);
                break;
            case 'gemini':
                schemaData = await generateWithGemini(contextMessages, prompt);
                break;
            default:
                schemaData = await generateWithQwen(contextMessages, prompt);
                break;
        }

        if (!schemaData || !Array.isArray(schemaData.tables) || schemaData.tables.length === 0 || !Array.isArray(schemaData.endpoints) || schemaData.endpoints.length === 0) {
            return res.status(422).json({ msg: "The AI generated an incomplete schema. Please provide a more detailed project idea." });
        }


        const newInteraction = [
            { role: 'user', content: prompt },
            { role: 'assistant', content: JSON.stringify(schemaData) }
        ];

        if (historyDoc) {
            historyDoc.messages.push(...newInteraction);
            historyDoc.updatedAt = Date.now();
            await historyDoc.save();
        } else {
            await LlmHistory.create({ projectId, messages: newInteraction });
        }

        return res.status(200).json({ data: schemaData });

    } catch (error) {
        if (error instanceof SyntaxError) {
            return res.status(422).json({ msg: "The AI generated an invalid structure. Please try again." });
        }
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}