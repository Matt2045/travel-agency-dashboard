import {account, appwriteConfig, client, database} from "~/appwrite/client";
import {ID, OAuthProvider, Query} from "appwrite";
import {redirect} from "react-router";

export const loginWithGoogle = async () => {
    try {
        // Request Google OAuth session with required scopes to read profile photo via People API
        account.createOAuth2Token({
            provider: OAuthProvider.Google,
            success: undefined,
            failure: undefined,
            scopes: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "email",
                "profile",
            ]
        })

    } catch (e) {

        console.log("loginWithGoogle", e)
    }


}
export const logoutUser = async () => {
    try {
        await account.deleteSession({ sessionId: "current" });
        return true;
    } catch (e) {

        console.log("logoutUser error: ", e);
    }


}
export const getUser = async () => {
    try {
        const user = await account.get();

        if(!user) return redirect("/sign-in")

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),

            ]
        )
    } catch (e) {

        console.log(e)
    }


}
export const getGooglePicture = async (): Promise<string | null> => {
    try {
        // Get the current OAuth session; for Google this contains providerAccessToken
        const session: any = await account.getSession({ sessionId: "current" })
        const accessToken: string | undefined = session?.providerAccessToken

        if (!accessToken) {
            console.warn("No Google provider access token available on the current session.")
            return null
        }

        const res = await fetch("https://people.googleapis.com/v1/people/me?personFields=photos", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!res.ok) {
            console.warn("Failed to fetch Google profile photo via People API", await res.text())
            return null
        }

        const data: any = await res.json()
        const photos: any[] = data?.photos || []
        // Prefer the default photo, otherwise first available
        const defaultPhoto = photos.find(p => p?.default)
        const url: string | null = defaultPhoto?.url || photos?.[0]?.url || null
        return url
    } catch (e) {
        console.log(e)
        return null
    }
}
export const storeUserData = async () => {
    try {
        const user = await account.get();

        if(!user) return null;

        //Check if user already exists in the database
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", user.$id),]
        );

        if(documents.length > 0) return documents[0];

        const imageUrl = await getGooglePicture();

        //Get profile photo from Google
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl,
                joinedAt: new Date().toISOString(),
            }

        )
    } catch (e) {

        console.log(e)
    }



}
export const getExistingUser = async () => {
    try {

    } catch (e) {

        console.log(e)
    }


}