"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_DEPARTMENTS_URL, REGISTER_OFFICIAL_URL } from "@/components/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function NewCourse() {

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

    const [isLoading, setIsLoading] = useState(true);

    const [managerEmail, setManagerEmail] = useState("");
    const [managerFullName, setManagerFullName] = useState("");
    const [managerDeptId, setManagerDeptId] = useState("-1");
    const [managerRoleId, setManagerRoleId] = useState("-1");

    const isValidManagerEmail = managerEmail.length > 0;
    const isValidManagerFullName = managerFullName.length > 0;
    const isValidManagerDeptId = managerDeptId != "-1" && managerDeptId.length > 0;
    const isValidManagerRoleId = managerRoleId != "-1" && managerRoleId.length > 0;

    const managerRoleOptions = [
        { value: "4", role: "Professor" }
    ];

    const [departmentData, setDepartmentData] = useState([]);

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

    }, []);


    const handleCreateNewCourse = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        fetch(REGISTER_OFFICIAL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("vc_t")}`
            },
            body: JSON.stringify({
                managerEmail: managerEmail,
                managerFullName: managerFullName,
                deptId: managerDeptId,
                roleId: managerRoleId
            }),
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data);
                    // buildDialog("Success", "New course created successfully", "Close");
                    // openModal();
                    // setCourseCode("");
                    // setCourseName("");
                    // setCourseType("-1");
                    // setmanagerDeptId(-1);

                    // redirect
                    router.push('/d/official');
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
                buildDialog("Error", "Failed to create new official", "Close");
                openModal();
            }
        }).catch((err) => {
            buildDialog("Error", "Failed to create new official", "Close");
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
                            <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Register New Official</h1>
                        </div>
                        <hr className='border-[#cdcdcd] w-full' />
                    </div>


                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                        <form className="space-y-6" onSubmit={handleCreateNewCourse}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Email ID
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        autoComplete="managerEmail"
                                        placeholder='Enter Official EmailID'
                                        onChange={(e) => setManagerEmail(e.target.value)}
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidManagerEmail && managerEmail ? ' ring-[#ffb3b3]' : isValidManagerEmail && managerEmail ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="managerFullName"
                                        placeholder='Enter Official Full Name'
                                        onChange={(e) => setManagerFullName(e.target.value)}
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidManagerFullName && managerFullName ? ' ring-[#ffb3b3]' : isValidManagerFullName && managerFullName ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Department
                                </label>
                                <div className="mt-2">
                                    <select
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidManagerDeptId && managerDeptId > 0 ? ' ring-[#ffb3b3]' : isValidManagerDeptId && managerDeptId > 0 ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        onChange={(e) => setManagerDeptId(e.target.value)}
                                    >
                                        <option value="-1">Select Department</option>
                                        {departmentData.map((dept, index) => (
                                            <option key={index} value={dept.deptId}>{dept.deptName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Role
                                </label>
                                <div className="mt-2">
                                    <select
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidManagerRoleId && managerRoleId > 0 ? ' ring-[#ffb3b3]' : isValidManagerRoleId && managerRoleId > 0 ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        onChange={(e) => setManagerRoleId(e.target.value)}
                                    >
                                        <option value="-1">Select Role</option>
                                        {managerRoleOptions.map((role, index) => (
                                            <option key={index} value={role.value}>{role.role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                {isLoading == false ? <input
                                    value="Register Official"
                                    type="submit"
                                    disabled={(isValidManagerEmail && isValidManagerFullName && isValidManagerRoleId && isValidManagerDeptId) ? false : true}
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