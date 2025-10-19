import { account, ID } from "../lib/appwrite";

async function createAccount(email: string, password: string, name: string): Promise<void> {
    try {
        const userAccount = await account.create({
            userId: ID.unique(),
            email: email,
            password: password,
            name: name
        })
        if (userAccount) {
            await account.createEmailPasswordSession({
                email: email,
                password: password
            })
        }
    } catch (error) {
        throw new Error("Failed to create account: " + error);
    }
}

async function login(email: string, password: string): Promise<Object> {
    try {
        const response = await account.createEmailPasswordSession({
            email,
            password
        })
        return response;

    } catch (error) {
        throw new Error("Failed to login: " + error);
    }
}
async function getCurrentUser(): Promise<any> {
    try {
        return await account.get();
    } catch (error) {
        throw new Error("Failed to get current user: " + error);
    }
}
async function logout(): Promise<void> {
    try {
        await account.deleteSession({
            sessionId: "current"
        });
    } catch (error) {
        throw new Error("Failed to logout: " + error);
    }
}
export { createAccount, login, getCurrentUser, logout };