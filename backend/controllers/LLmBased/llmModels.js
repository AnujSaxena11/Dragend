import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from './prompt.js';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWithQwen(contextMessages, prompt) {
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...contextMessages,
        { role: "user", content: `Generate a backend schema JSON for: ${prompt}. Remember to output raw JSON only.` }
    ];
    const response = await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",
        messages: messages,
        temperature: 0.1,
        max_completion_tokens: 4000,
        response_format: { type: "json_object" },
        reasoning_format: "hidden"
    });
    return JSON.parse(response.choices[0].message.content);
}

export async function generateWithLlamaScout(contextMessages, prompt) {
    const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...contextMessages,
            { role: "user", content: `Generate a backend schema JSON for: ${prompt}. Remember to output raw JSON only.` }
        ],
        temperature: 0.1,
        max_completion_tokens: 4000,
        response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
}

export async function generateWithLlama70B(contextMessages, prompt) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...contextMessages,
            { role: "user", content: `Generate a backend schema JSON for: ${prompt}. Remember to output raw JSON only.` }
        ],
        temperature: 0.1,
        max_completion_tokens: 4000,
        response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
}

export async function generateWithGemini(contextMessages, prompt) {
    const formattedHistory = contextMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
    }));

    const contents = [
        ...formattedHistory,
        { role: "user", parts: [{ text: `Generate a backend schema JSON for: ${prompt}. Remember to output raw JSON only.` }] }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.1,
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
}