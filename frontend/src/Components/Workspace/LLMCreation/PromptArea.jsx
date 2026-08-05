import React, { useState, useRef, useEffect } from 'react';

function PromptArea({ projectId, onSuccess }) {
    const BASE_URL = import.meta.env.VITE_BACKEND_BASE_API;
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState({ id: 'qwen', name: 'Qwen', label: 'Ultra Fast' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRef = useRef(null);
    const textareaRef = useRef(null);
    const models = [
        { id: 'qwen', name: 'Qwen', label: 'Ultra Fast' },
        { id: 'scout', name: 'Llama Scout', label: 'High Precision' },
        { id: 'llama70b', name: 'Llama 70B', label: 'Deep Reasoning' },
        { id: 'gemini', name: 'Gemini flash', label: 'Balanced' },
    ];

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
        }
    }, [prompt]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSend = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        try {
            const payload = {
                prompt: prompt.trim(),
                model: selectedModel.id,
                projectId: projectId
            };
            const res = await fetch(`${BASE_URL}/project/generate/${projectId}/llm`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const responseData = await res.json();
            if (!res.ok) {
                throw new Error(responseData.msg || "Failed to generate schema");
            } if (res.ok && onSuccess) {
                console.log(responseData.data);

                onSuccess(responseData.data);
            }
            setPrompt('');
        } catch (error) {
            console.error("LLM Generation Error:", error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 bg-[#202020] px-4 py-2.5 rounded-4xl shadow-2xl border border-gray-500 w-[90%] max-w-2xl transition-all duration-200 focus-within:border-gray-600">
            <div className="relative mb-0.5" ref={dropdownRef}>
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#323232] text-sm text-gray-300 border border-gray-700/50 transition-colors">
                    <span className="truncate max-w-[100px]">{selectedModel.name}</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div className="absolute bottom-full mb-2 left-0 w-52 bg-[#1c1c1c] border border-gray-800 rounded-xl shadow-2xl py-1.5 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <div className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Select AI Engine
                        </div>
                        {models.map((model) => (
                            <button
                                key={model.id}
                                type="button"
                                onClick={() => {
                                    setSelectedModel(model);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm flex flex-col gap-0.5 transition-colors ${selectedModel.id === model.id
                                    ? 'bg-[#252525] text-white'
                                    : 'text-gray-400 hover:bg-[#252525]/60 hover:text-gray-200'
                                    }`}
                            >
                                <span className="font-medium">{model.name}</span>
                                <span className="text-[11px] text-gray-500">{model.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <textarea ref={textareaRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyDown} placeholder="Design with AI..." rows={1}
                className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-24 py-1.5 
                overflow-y-auto
                [&::-webkit-scrollbar]:w-1.5 
                [&::-webkit-scrollbar-track]:bg-transparent 
                [&::-webkit-scrollbar-thumb]:bg-[#3a3a3a] 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                hover:[&::-webkit-scrollbar-thumb]:bg-[#4a4a4a]"
                style={{ height: 'auto' }} />
            <button type="button" onClick={handleSend} disabled={!prompt.trim() || isLoading}
                className={`p-2 rounded-xl mb-0.5 transition-all duration-200 ${prompt.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20 active:scale-95'
                    : isLoading
                        ? 'bg-blue-600 text-white cursor-wait'
                        : 'bg-transparent text-gray-600 cursor-not-allowed'
                    }`}>
                {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default PromptArea;