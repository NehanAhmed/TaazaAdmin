import { OAuthProvider, type Models } from "appwrite";
import { account } from "../lib/appwrite";

/**
 * Initiates Google OAuth2 login flow
 * Redirects user to Google authentication
 */
async function googleLogin(): Promise<void> {
    try {
        await account.createOAuth2Session(
            OAuthProvider.Google,
            "http://localhost:5173/auth/success",
            "http://localhost:5173/auth/failure",
            ["email", "profile", "openid"]
        );
    } catch (error) {
        console.error("Google login error:", error);
        throw new Error(
            `Failed to login with Google: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Retrieves the currently authenticated user
 * @returns User account information or null if not authenticated
 */
async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
        return await account.get();
    } catch (error) {
        // User is not authenticated - this is expected behavior
        if (error instanceof Error && error.message.includes("401")) {
            return null;
        }
        console.error("Get current user error:", error);
        throw new Error(
            `Failed to get current user: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Logs out the current user by deleting the active session
 */
async function logout(): Promise<void> {
    try {
        await account.deleteSession("current");
    } catch (error) {
        console.error("Logout error:", error);
        throw new Error(
            `Failed to logout: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

export { googleLogin, getCurrentUser, logout };