import { Client, Account, TablesDB} from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL ) // Replace with your Appwrite endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';

export const tablesDB = new TablesDB(client);
