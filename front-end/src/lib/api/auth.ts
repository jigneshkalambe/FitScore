import Axios from "@/instance/Axios";

const registerUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
        const response = await Axios.post("/auth/register", { name, email, password });
        const { token, user } = response.data.data;
        return { token: token, user: user };
    } catch (error) {
        throw new Error("Could not create account. Try again");
    }
};
const loginUser = async ({ email, password }: { email: string; password: string }) => {
    try {
        const response = await Axios.post("/auth/login", { email, password });
        console.log("response", response.data);
        const { token, user } = response.data.data;
        return { token: token, user: user };
    } catch (error) {
        throw new Error("Could not log in. Try again");
    }
};
export { registerUser, loginUser };
