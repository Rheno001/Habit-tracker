import { Account, Client } from 'react-native-appwrite';

export const client = new Client()
    .setPlatform('com.reno.firstapp')
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
