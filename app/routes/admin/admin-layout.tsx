import React from 'react'
import {Outlet, redirect} from "react-router";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import {MobileSidebar, NavItems} from "../../../components";
import {account} from "~/appwrite/client";
import {getExistingUser, loginWithGoogle, storeUserData} from "~/appwrite/auth";

// Grundlogik: Kein User -> Sign-in || User vorhanden -> /
// Logik 2: Admin -> Dashboard || User -> /

export async function clientLoader() {
    try {
        const user = await account.get();

        if(!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);


        if(existingUser?.status === 'user') {
            return redirect('/');
        }

        return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
        console.log('Error in clientLoader', e)
        return redirect('/sign-in')
    }
}




export default function AdminLayout() {
    const user = account.get();

    console.log("User", user);

    return (
        <div className="admin-layout">

            <MobileSidebar />
            <aside className="w-full max-w-[270px] hidden lg:block">Sidebar</aside>
                <SidebarComponent width={270} enableGestures={false} >
                    <NavItems />
                </SidebarComponent>
            <aside className="children">
                <Outlet />
            </aside>

        </div>
    )
}
