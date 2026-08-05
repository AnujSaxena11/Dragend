import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "../../layout/Header";
import { StepTechStack } from "../form/StepTechStack";
import { StepDatabase } from "../form/StepDatabase";
import { StepConnect } from "../form/StepConnect";
import { StepBehavior } from "../form/StepBehavior";
import { StepIdentity } from "../form/StepIndentity";
import { CreateProjectAPI } from "../CreateProjectAPI";
import { useNavigate } from "react-router-dom";
import { MiniBot } from "../../bot/MiniBot";
import toast, { Toaster } from 'react-hot-toast';

const STEPS = [1, 2, 3, 4, 5];

export function DragEndCreateFlow() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    backend: "",
    dbType: "",
    environment: "", 
    connectionMode: "", 
    authType: "",
    connectionName: "",
    serviceName: "",
    host: "localhost",
    port: "",
    uri: "",
    username: "",
    password: "",
  });

  const update = (k, v) => {
    setFormData((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: null }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await CreateProjectAPI(formData);
      if (res.success) {
        setLoading(false);
        const newProjectId = res.data.projectId;
        if (newProjectId) {
          navigate(`/${newProjectId}/workflow`);
        } else {
          toast.error("Project ID not found in response:", res.data);
        }
      }
    } catch (err) {
      toast.error(err);
      setLoading(false); 
    }
  };

  const validateStep = () => {
    const e = {};

    if (step === 1 && !formData.projectName) {
      e.projectName = "Project name required.";
    }

    if (step === 2) {
      if (!formData.backend) e.backend = "Select backend.";
    }

    if (step === 3) {
      if (!formData.dbType) e.dbType = "Select database!";
      if (!formData.environment) e.environment = "Select environment (Local or Deployed)!";
    }

    if (step === 4) {
      if (!formData.connectionName) e.connectionName = "Connection Name Required";

      if (formData.environment === "local") {
        if (formData.dbType !== "mongodb") {
          if (!formData.host) e.host = "Host is required (e.g., localhost)";
          if (!formData.port) e.port = "Port is required";
          if (!formData.username) e.username = "Username required";
          if (!formData.password) e.password = "Password required";
        }
      } 
      else if (formData.environment === "deployed") {
        if (formData.connectionMode === "uri" || !formData.connectionMode) {
          if (!formData.uri) e.uri = "Public Database URI required";
        } else if (formData.connectionMode === "credentials") {
          if (!formData.host) e.host = "Public Host is required";
          if (!formData.port) e.port = "Port is required";
          if (!formData.username) e.username = "Username required";
          if (!formData.password) e.password = "Password required";
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validateStep() && setStep((s) => Math.min(5, s + 1));
  
  const back = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header />
      <div className="absolute inset-0 z-0">
        <video
          src={import.meta.env.VITE_BG_VIDEO_URL}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg" />
      </div>

      <div className="relative z-10 container mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 p-6">
        <div className="hidden lg:flex flex-col max-w-sm space-y-10">
          <h1 className="text-4xl font-bold leading-tight">
            Let’s build your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Backend Logic
            </span>
          </h1>

          <div className="space-y-3">
            {["Identity", "Tech Stack", "Database", "Connect", "Behavior"].map(
              (label, i) => {
                const stepNumber = i + 1;
                return (
                  <div
                    key={label}
                    className={`flex items-stretch gap-3 ${step === stepNumber ? "opacity-100" : "opacity-40"
                      }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${step >= stepNumber ? "bg-pink-500" : "bg-gray-300"
                        }`}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                );
              },
            )}
          </div>

          <MiniBot step={step} errors={errors} />
        </div>

        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && (
                  <StepIdentity
                    formData={formData}
                    errors={errors}
                    update={update}
                  />
                )}
                {step === 2 && (
                  <StepTechStack formData={formData} update={update} />
                )}
                {step === 3 && (
                  <StepDatabase formData={formData} update={update} />
                )}
                {step === 4 && (
                  <StepConnect
                    formData={formData}
                    errors={errors}
                    update={update}
                  />
                )}
                {step === 5 && <StepBehavior />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 border-t flex justify-between bg-gray-50/50">

            <button
              onClick={back}
              className="flex items-center gap-2 text-gray-600 cursor-pointer transition-colors hover:text-gray-900 active:scale-95"
            >
              <ArrowLeft size={16} /> {step === 1 ? "Back to Home" : "Back"}
            </button>

            {step < 5 && (
              <button
                onClick={next}
                className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Continue <ArrowRight size={16} className="inline ml-1" />
              </button>
            )}
            {step === 5 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`cursor-pointer px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all ${loading ? 'opacity-70 pointer-events-none' : 'active:scale-95'}`}
              >
                {loading ? "Creating..." : "Submit"} {!loading && <ArrowRight size={16} className="inline ml-1" />}
              </button>
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}