import axios from 'axios';

const BASE_API = import.meta.env.VITE_BASE_API;

export const saveWorkflowData = async (projectId, payload) => {
    try {
        const response = await axios.put(
            `${BASE_API}/project/${projectId}/workflow`,
            payload,
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Save Workflow Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getProjectData = async (projectId) => {
    try {
        const response = await axios.get(
            `${BASE_API}/project/${projectId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Get Project Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteProjectAPI = async (projectId) => {
    try {
        const response = await axios.delete(
            `${BASE_API}/project/${projectId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Delete Project Error:", error.response?.data || error.message);
        throw error;
    }
};

export const downloadProjectAPI = async (projectId, projectName = 'Project') => {
    try {
        const response = await axios.get(
            `${BASE_API}/project/generate/${projectId}/download`,
            { 
                withCredentials: true,
                responseType: 'blob'
            }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `${projectName}.zip`;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (err) {
        console.error("Download Project Error:", err);
        throw err;
    }
};