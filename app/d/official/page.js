"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { ALL_OFFICIALS_URL, GET_DEPARTMENTS_URL } from "@/components/api";
import { roleIdToRoleName } from "@/components/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function AllOfficialsPage() {

    const [isLoading, setIsLoading] = useState(true);
    // For The AlertDialogModal
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('');

    const [searchText, setSearchText] = useState('');

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const router = useRouter();

    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        fetch(ALL_OFFICIALS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t"),
            },
        }).then((res) => {

            if (res.status === 200) {
                res.json().then((data) => {
                    setData(data["data"]);
                    setFilteredData(data["data"]);

                    console.log(data["data"]);
                });
            } else {
                buildDialog("Error", "Failed to fetch officials", "Close");
            }

        }).catch((err) => {
            buildDialog("Error", "Failed to fetch officials", "Close");
            openModal();

        }).finally(() => {
            setIsLoading(false);
        });

    }, []);

    useEffect(() => {
        if (data !== null) {
            setFilteredData(data.filter((official) => {
                return official.managerFullName.toLowerCase().includes(searchText.toLowerCase());
            }));
        }
    }, [searchText]);


    return (
        <>
            <NavBar />

            {isLoading ? <LoadingScreen /> : (
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center">
                    <p className="text-lg font-light mt-0">{new Date().toDateString()}</p>
                    <h1 className="text-2xl font-bold mt-4">All Officials</h1>

                    <Link href="/d/official/new" className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-2xl -[64%] text-center  hover:cursor-pointer">Register New Official</Link>

                    <input
                        type="text"
                        placeholder="Search for an official"
                        className="w-[64%] mt-4 p-2 rounded-2xl"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />

                    {(filteredData === null || filteredData.length === 0) && isLoading === false ? (
                        <p className="text-lg font-light mt-4">No officials found</p>
                    ) : null}

                    {filteredData !== null && filteredData.length > 0 ? (
                        <table className="w-[80%] mt-4 bg-white rounded-2xl">
                            <thead>
                                <tr>
                                    <th className="bg-black text-white p-2 rounded-tl-2xl">Name</th>
                                    <th className="bg-black text-white p-2">Email</th>
                                    <th className="bg-black text-white p-2">Department</th>
                                    <th className="bg-black text-white p-2 rounded-tr-2xl">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((official, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="p-2">{official.managerFullName}</td>
                                            <td className="p-2">{official.managerEmail}</td>
                                            <td className="p-2">{official.deptName}</td>
                                            <td className="p-2">{roleIdToRoleName(official.roleId)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : null}


                </main>
            )}

            < DialogModal
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={message}
                buttonLabel={buttonLabel}
            />

        </>
    )


}