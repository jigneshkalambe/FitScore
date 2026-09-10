import Axios from "@/lib/axios";

const registerUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const response = await Axios.post("/auth/register", { name, email, password });
    const { token, user } = response.data.data;
    return { token: token, user: user };
};
const loginUser = async ({ email, password }: { email: string; password: string }) => {
    const response = await Axios.post("/auth/login", { email, password });
    const { token, user } = response.data.data;
    return { token: token, user: user };
};

const getMe = async () => {
    const response = await Axios.get("/auth/me");
    return response.data.data;
};
export { registerUser, loginUser, getMe };
