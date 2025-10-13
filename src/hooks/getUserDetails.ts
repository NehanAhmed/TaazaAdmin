import { getCurrentUser } from "../appwrite/auth";

export async function getUserDetails() {
    try {
        const user = await getCurrentUser();
        return user;
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}
