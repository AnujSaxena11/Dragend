import { CheckCircle, FolderOpen, Terminal, Play, Server, Code2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserGuide() {
    const navigate = useNavigate();

    const steps = [
        {
            icon: FolderOpen,
            title: "Extract Files",
            desc: "Locate the downloaded .zip file and extract it to your desired folder."
        },
        {
            icon: Code2,
            title: "Open in Editor",
            desc: "Open the extracted folder in VS Code or your preferred code editor."
        },
        {
            icon: Terminal,
            title: "Install Dependencies",
            desc: "Open a terminal in the project root and run the following command:",
            command: "npm install"
        },
        {
            icon: Play,
            title: "Start the Server",
            desc: "Once installed, start the backend server with:",
            command: "npm start"
        },
        {
            icon: Server,
            title: "Verify Connection",
            desc: "Your server is now running! You can test your routes at:",
            highlight: "http://localhost:8081"
        }
    ];

    return (
        <div className="flex-1 h-screen bg-[#1e1e1e] overflow-y-auto text-white p-8 flex flex-col items-center">
            
            <div className="flex flex-col items-center gap-6 mt-10 mb-12 animate-fade-in-up">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={64} className="text-green-500 drop-shadow-md" weight="bold" />
                </div>
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Project Downloaded Successfully!
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Follow the steps below to initialize and run your backend server.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-4xl grid gap-4 mb-10">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className="bg-[#2a2a2a] border border-white/5 rounded-xl p-6 flex items-start gap-6 hover:border-purple-500/30 transition-all duration-300 shadow-lg"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Step 0{index + 1}</span>
                            <div className="w-12 h-12 bg-[#333] rounded-lg flex items-center justify-center text-purple-400">
                                <step.icon size={24} />
                            </div>
                        </div>

                        <div className="flex-1 pt-1">
                            <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                            <p className="text-gray-400 mb-3">{step.desc}</p>
                            
                            {step.command && (
                                <div className="bg-[#111] border border-white/10 rounded-md py-3 px-4 flex justify-between items-center w-fit group cursor-pointer hover:border-purple-500/50"
                                     onClick={() => {navigator.clipboard.writeText(step.command); toast.success('Copied!')}}>
                                    <code className="text-green-400 font-mono text-sm">
                                        &gt; {step.command}
                                    </code>
                                    <span className="text-xs text-gray-600 ml-4 group-hover:text-gray-400">Click to copy</span>
                                </div>
                            )}

                            {step.highlight && (
                                <span className="inline-block bg-purple-500/10 text-purple-300 px-3 py-1 rounded-md font-mono text-sm border border-purple-500/20">
                                    {step.highlight}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10"
            >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
            </button>
        </div>
    );
}

export default UserGuide;