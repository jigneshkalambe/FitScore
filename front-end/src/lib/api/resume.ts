import Axios from "@/instance/Axios";

interface UploadResumeResponse {
    success: boolean;
    message: string;
    data: {
        fileName: string;
        extractedText: string;
    };
}

const uploadResume = async (file: File): Promise<UploadResumeResponse> => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await Axios.post("/resume/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export { uploadResume };
