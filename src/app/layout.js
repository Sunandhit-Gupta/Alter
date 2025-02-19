"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";

export default function RootLayout({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            router.push("/auth/login");
        }
    }, []);

    return (
        <html>
            <body>
                {user && <Navbar role={user.role} />}
                <main>{children}</main>
            </body>
        </html>
    );
}
