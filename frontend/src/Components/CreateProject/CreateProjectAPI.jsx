import axios from 'axios';

const BASE_API = import.meta.env.VITE_BASE_API;

export async function CreateProjectAPI(data) {
  try {
    const res = await axios.post(`${BASE_API}/project/create`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json" 
      }
    });
    return {
      status: res.status,
      success: true, 
      data: res.data
    };

  } catch (error) {
    console.error("CreateProjectAPI Error:", error);
    if (error.response) {
      return {
        status: error.response.status,
        success: false,
        error: error.response.data || error.message
      };
    }
    return {
      status: 500,
      success: false,
      error: error.message
    };
  }
}