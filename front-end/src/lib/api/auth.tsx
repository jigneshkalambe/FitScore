const registerUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    return { token: "sample-token", user: { id: "sample-id", name, email } };
};
const loginUser = async ({ email, password }: { email: string; password: string }) => {
    return { token: "sample-token", user: { id: "sample-id", name: "Sample User", email } };
};
export { registerUser, loginUser };
