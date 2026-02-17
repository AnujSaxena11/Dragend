import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, Clock, Braces, ArrowRightLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function LivePreview() {
    // State for the Request
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState(`${import.meta.env.VITE_BASE_API}/custom-route`); // Set your default test URL base here
    const [requestBody, setRequestBody] = useState('{\n\t"key": "value"\n}');
    
    // State for the Response
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("body"); // 'body' or 'params' (expandable)

    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    const handleSend = async () => {
        setLoading(true);
        setResponse(null);
        const startTime = Date.now();

        try {
            // Parse JSON body if method is not GET
            let data = null;
            if (method !== "GET" && method !== "DELETE") {
                try {
                    data = JSON.parse(requestBody);
                } catch (e) {
                    toast.error("Invalid JSON in Request Body");
                    setLoading(false);
                    return;
                }
            }

            const res = await axios({
                method,
                url,
                data,
                validateStatus: () => true, // Don't throw error on 4xx/5xx
            });

            const endTime = Date.now();
            setResponse({
                status: res.status,
                statusText: res.statusText,
                data: res.data,
                time: endTime - startTime,
                size: JSON.stringify(res.data).length,
            });

            if (res.status >= 200 && res.status < 300) {
                toast.success(`Request Successful (${res.status})`, {
                    style: { background: '#333', color: '#fff', border: '1px solid #22c55e' }
                });
            } else {
                toast.error(`Request Failed (${res.status})`, {
                     style: { background: '#333', color: '#fff', border: '1px solid #ef4444' }
                });
            }

        } catch (error) {
            console.error(error);
            const endTime = Date.now();
            setResponse({
                status: 0,
                statusText: "Network Error",
                data: { error: error.message },
                time: endTime - startTime,
            });
            toast.error("Network Error - Check Console");
        } finally {
            setLoading(false);
        }
    };

    // Helper to colorize status codes
    const getStatusColor = (status) => {
        if (status === 0) return "text-red-500";
        if (status >= 200 && status < 300) return "text-green-500";
        if (status >= 400) return "text-orange-500";
        return "text-gray-400";
    };

    return (
        <div className="flex flex-col h-screen bg-[#1B1B1B] text-white p-6 overflow-hidden">
            
            {/* --- Header Section --- */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <ArrowRightLeft className="text-purple-500" />
                    API Playground
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Test your generated endpoints directly from the browser.
                </p>
            </div>

            {/* --- Request Bar --- */}
            <div className="flex gap-0 mb-6 bg-[#252525] rounded-lg border border-gray-700 p-1 shadow-lg">
                <select 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)}
                    className="bg-transparent text-sm font-bold px-4 py-2 outline-none border-r border-gray-700 cursor-pointer hover:text-purple-400 transition-colors"
                >
                    {methods.map(m => <option key={m} value={m} className="bg-[#252525]">{m}</option>)}
                </select>
                <input 
                    type="text" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to test..."
                    className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-200 placeholder-gray-500"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Send
                </button>
            </div>

            {/* --- Main Content Split --- */}
            <div className="flex-1 flex gap-6 min-h-0">
                
                {/* Left: Request Body */}
                <div className="flex-1 flex flex-col bg-[#202020] rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                    <div className="px-4 py-2 border-b border-gray-700 bg-[#252525] flex items-center gap-2">
                        <Braces size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Request Body (JSON)</span>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            disabled={method === 'GET' || method === 'DELETE'}
                            className={`w-full h-full bg-[#1e1e1e] p-4 text-sm font-mono text-gray-300 outline-none resize-none custom-scrollbar
                                ${method === 'GET' || method === 'DELETE' ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            spellCheck="false"
                        />
                        {(method === 'GET' || method === 'DELETE') && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-gray-600 text-sm font-medium">Body not available for {method}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Response Viewer */}
                <div className="flex-1 flex flex-col bg-[#202020] rounded-xl border border-gray-700 overflow-hidden shadow-lg relative">
                    <div className="px-4 py-2 border-b border-gray-700 bg-[#252525] flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Response</span>
                        
                        {response && (
                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-bold flex items-center gap-1.5 ${getStatusColor(response.status)}`}>
                                    {response.status >= 200 && response.status < 300 ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                    {response.status} {response.statusText}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock size={10} /> {response.time}ms
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {response.size} B
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e] p-4">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                                <Loader2 size={32} className="animate-spin text-purple-500" />
                                <span className="text-xs">Sending Request...</span>
                            </div>
                        ) : response ? (
                            <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-all">
                                {JSON.stringify(response.data, null, 2)}
                            </pre>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                <ArrowRightLeft size={32} className="mb-2 opacity-50" />
                                <span className="text-xs">Enter URL and click Send to see response</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LivePreview;