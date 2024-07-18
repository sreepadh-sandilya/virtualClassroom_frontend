"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { logout } from "./helpers";

export default function NavBar() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        if (secureLocalStorage.getItem("vc_m") && secureLocalStorage.getItem("vc_t") && secureLocalStorage.getItem("vc_r")) {
            setIsLoggedIn(true);
            setUserRole(secureLocalStorage.getItem("vc_r"));
        }
    }, []);

    return (
        <header data-aos="fade-in" className="flex justify-center items-center w-fit ml-auto mr-auto sticky z-40 top-0 mt-4">
            <nav className="w-fit ml-auto mr-auto rounded-3xl h-fit bg-[#f3f3f3] bg-opacity-70 backdrop-blur-lg align-middle p-2 relative
            m-0 px-2 z-10 flex items-center flex-col space-y-2 border border-[#d8d8d8] shadow-sm">
                {/* Main Navigation */}
                <ul className="flex flex-row justify-center align-middle items-center space-x-4">
                    <Link className="rounded-2xl h-fit bg-[#ffffff] backdrop:blur-lg flex justify-center items-center align-middle px-2 py-3 text-black cursor-pointer hover:bg-[#000000] hover:px-4 hover:text-white hover:shadow-lg w-fit ml-auto mr-auto my-0" href="/">
                        <span className="font-semibold">VC@Amrita</span>
                    </Link>
                    {isLoggedIn === false ? <Link className="rounded-2xl h-fit backdrop:blur-lg flex justify-center items-center align-middle px-2 py-3 text-black cursor-pointer hover:bg-black hover:px-4 hover:text-white hover:shadow-lg w-fit ml-auto mr-auto my-0" href="/auth/login">
                        <span className="font-semibold">Login</span>
                    </Link> : null}
                    {isLoggedIn === true && userRole !== "S" ? <Link className="rounded-2xl h-fit backdrop:blur-lg flex justify-center items-center align-middle px-2 py-3 text-black cursor-pointer hover:bg-black hover:px-4 hover:text-white hover:shadow-lg w-fit ml-auto mr-auto my-0" href={`/${userRole.toLowerCase()}`}>
                        <span className="font-semibold">Home</span>
                    </Link> : null}
                    {isLoggedIn === true && userRole === "S" ? <Link className="rounded-2xl h-fit backdrop:blur-lg flex justify-center items-center align-middle px-2 py-3 text-black cursor-pointer hover:bg-black hover:px-4 hover:text-white hover:shadow-lg w-fit ml-auto mr-auto my-0" href="/s">
                        <span className="font-semibold">Home</span>
                    </Link> : null}
                    {isLoggedIn === true ? <Link href={"/auth/login"} className="rounded-2xl h-fit backdrop:blur-lg flex justify-center items-center align-middle px-2 py-3 text-black cursor-pointer hover:bg-black hover:px-4 hover:text-white hover:shadow-lg w-fit ml-auto mr-auto my-0" onClick={() => {
                        secureLocalStorage.clear();
                        window.location.href = "/auth/login";
                    }}>
                        <span className="font-semibold">Logout</span>
                    </Link> : null}
                </ul>
            </nav>
        </header>
    );
}
