"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { EDIT_DEPARTMENT_URL, GET_DEPARTMENT_URL_PREFIX } from "@/components/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function EditDepartmentScreen() {

    // For The AlertDialogModal
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('');

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const router = useRouter();
    const { deptId } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const isValidDepartmentName = departmentName.length > 0;

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    useEffect(() => {
        fetch(`${GET_DEPARTMENT_URL_PREFIX}/${deptId}` , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {

            if (res.status === 200) {
                res.json().then((data) => {
                    if (data["data"].length === 0) {
                        buildDialog("Error", "No departments found", "Close");
                        openModal();
                    }

                    setDepartmentName(data["data"][0]["deptName"]);
                });
            } else {
                buildDialog("Error", "Failed to fetch departments", "Close");
            }

        }).catch((err) => {

            buildDialog("Error", "Failed to fetch departments", "Close");

        }).finally(() => {
            setIsLoading(false);
        });
    }, []);


    const handleUpdateDepartment = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        console.log("here");

        fetch(EDIT_DEPARTMENT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("vc_t")}`
            },
            body: JSON.stringify({
                "deptId": deptId,
                "deptName": departmentName.toString().trim(),
            }),
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data);
                    // buildDialog("Success", "New department created successfully", "Close");
                    // openModal();
                    // redirect
                    router.push('/a/department');
                });
            } else if (res.status === 401) {
                buildDialog("Error", "Unauthorized Access", "Close");
                openModal();
                // secureLocalStorage.clear();
                // router.push("/auth/login");
            } else if (res.status === 400) {
                res.json().then((data) => {
                    buildDialog("Error", data["message"], "Close");
                    openModal();
                });
            } else {
                buildDialog("Error", "Failed to create new department", "Close");
                openModal();
            }
        }).catch((err) => {
            buildDialog("Error", "Failed to create new department", "Close");
            openModal();
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        });
    }



    return (<>
        <NavBar />

        {isLoading ? <LoadingScreen /> : (
            <main className="flex min-h-[80vh] flex-1 flex-col justify-center mt-4 md:mt-0">
                <div className="border border-[#cdcdcd] rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-[#f9f9f9] bg-opacity-40 shadow-sm">
                    <div
                        className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-2xl"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[64%] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3c8292] to-[#a9afde] opacity-10"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%, 45.2% 34.5%)',
                            }}
                        />
                    </div>

                    <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                        <div className='flex flex-row justify-center'>
                            <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Update Department</h1>
                        </div>
                        <hr className='border-[#cdcdcd] w-full' />
                    </div>


                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                        <form className="space-y-6" onSubmit={handleUpdateDepartment}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Department Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="departmentName"
                                        value={departmentName}
                                        placeholder='Enter Department Name'
                                        onChange={(e) => setDepartmentName(e.target.value)}
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidDepartmentName && departmentName ? ' ring-[#ffb3b3]' : isValidDepartmentName && departmentName ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                <input type="button" value="Cancel" onClick={() => router.push('/a/department')} className="w-full mr-2 text-lg rounded-lg bg-white text-black p-2 cursor-pointer" />
                                {isLoading == false ? <input
                                    value="Update"
                                    type="submit"
                                    disabled={(isValidDepartmentName) ? false : true}
                                    className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-[#d7d7d7] disabled:cursor-not-allowed disabled:text-[#696969] disabled:border disabled:border-[#c8c8c8] "} /> :
                                    <input
                                        value="Loading..."
                                        type="submit"
                                        disabled={true}
                                        className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-[#d7d7d7]  disabled:text-[#696969] disabled:cursor-not-allowed disabled:border disabled:border-[#c8c8c8]"} />
                                }
                            </div>



                        </form>
                    </div>


                </div>
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
    );
}