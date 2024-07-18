"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_DEPARTMENTS_URL, NEW_STUDENT_URL } from "@/components/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function RegisterStudents() {

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

    const [departmentData, setDepartmentData] = useState([]);
    const [courseDeptId, setCourseDeptId] = useState('-1');
    const isValidCourseDeptId = courseDeptId !== '-1' && courseDeptId.length > 0;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    useEffect(() => {
        fetch(GET_DEPARTMENTS_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {

            if (res.status === 200) {
                res.json().then((data) => {
                    setDepartmentData(data["data"]);
                });
            } else {
                buildDialog("Error", "Failed to fetch departments", "Close");
            }

        }).catch((err) => {

            buildDialog("Error", "Failed to fetch departments", "Close");

        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    const handleCreateNew = async (e) => {
        e.preventDefault();

        // Parse the CSV file and convert it to JSON
        /*
        studentData: [
                    {
                        "studentName": "string",
                        "studentRollNumber": "string",
                        "studentGender": "string",
                        "studentPhone": "string",
                        "studentEmail": "string",
                        "studentDob": "string",
                        "studentDeptId": "string",
                        "studentSection": "string",
                        "studentBatchStart": "string",
                        "studentBatchEnd": "string"
                    },
                    ...
                ]
        */

        

        const file = e.target[1].files[0];

        const studentData = [];

        // build studentData

        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                const lines = e.target.result.split("\n");

                const headers = lines[0].split(",");
                for (let i = 1; i < lines.length; i++) {
                    const obj = {};
                    const currentline = lines[i].split(",");
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j].trim()] = currentline[j].trim();
                        obj["studentDeptId"] = courseDeptId;
                    }
                    studentData.push(obj);
                }

                fetch(NEW_STUDENT_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t"),
                    },
                    body: JSON.stringify({
                        "studentData": studentData
                    }),
                }).then((res) => {
                    if (res.status == 200) {
        
                        buildDialog("Success", "Students registered successfully", "Close");
                        openModal();
        
                        setTimeout(() => {
                            router.push("/o");
                        }, 2000);
        
                    } else if (res.status == 400) {
                        res.json().then((data) => {
                            buildDialog("Error", data.message, "Close");
                            openModal();
                        });
                    } else {
                        buildDialog("Error", "Failed to register students", "Close");
                        openModal();
                    }
                }).catch((err) => {
                    buildDialog("Error", "Failed to register students", "Close");
                    openModal();
                }).finally(() => {
                    setIsLoading(false);
                });
            }
        }

    }

    return (
        <>
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
                                <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Register Students</h1>
                            </div>
                            <hr className='border-[#cdcdcd] w-full' />
                        </div>


                        <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                            <form className="space-y-6" onSubmit={handleCreateNew}>
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Department That Students belong to
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidCourseDeptId && courseDeptId > 0 ? ' ring-[#ffb3b3]' : isValidCourseDeptId && courseDeptId > 0 ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            onChange={(e) => setCourseDeptId(e.target.value)}
                                        >
                                            <option value="-1">Select Department</option>
                                            {departmentData.map((dept, index) => (
                                                <option key={index} value={dept.deptId}>{dept.deptName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <hr className='border-[#cdcdcd] w-full' />

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Upload CSV File
                                    </label>
                                    <p className="text-sm text-gray-500">The CSV file should contain the following columns in any order: </p>
                                    <p className="text-sm text-gray-700 bg-white p-2 rounded-2xl my-4">
                                        studentName, studentRollNumber, studentGender, studentPhone, studentEmail, studentDob(YYYY-MM-DD), studentSection(eg. A), studentBatchStart(eg. 2021), studentBatchEnd(eg. 2025)
                                    </p>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="w-full text-lg rounded-lg bg-white p-2 cursor-pointer"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    {isLoading == false ? <input
                                        value="Register Students"
                                        type="submit"
                                        disabled={!isValidCourseDeptId}
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