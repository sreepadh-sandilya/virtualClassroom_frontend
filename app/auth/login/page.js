"use client";

import DialogModal from "@/components/DialogModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import validator from 'validator';
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { LOGIN_URL } from "@/components/api";
import secureLocalStorage from "react-secure-storage";

export default function LoginScreen() {
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

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const isValidPassword = userPassword.length >= 8;
    const isValidEmail = validator.isEmail(userEmail);

    const [isLoading, setIsLoading] = useState(false);

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isValidEmail || !isValidPassword) {
            buildDialog('Invalid Email/Password', 'Please enter a valid EmailID/Password to continue', 'Okay');
            openModal();
            return;
        }

        setIsLoading(true);

        fetch(LOGIN_URL, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "userEmail": userEmail,
                "userPassword": userPassword
            })
        }).then((res) => {

            if (res.status == 200) {
                res.json().then((data) => {
                    switch (data["userRole"]) {
                        case "S":
                            secureLocalStorage.setItem("vc_t", data["SECRET_TOKEN"]);
                            // console.log(data["studentData"]);
                            /*
                             {
                                "studentId": 1,
                                "studentName": "Ashwin Narayanan S",
                                "studentRollNumber": "CB.EN.U4CSE21008",
                                "studentGender": "M",
                                "studentPhone": "8870014773",
                                "studentEmail": "cb.en.u4cse21008@cb.students.amrita.edu",
                                "studentDob": "2003-10-13",
                                "studentDeptId": 1,
                                "deptName": "CSE",
                                "studentSection": "A",
                                "studentBatchStart": "2021",
                                "studentBatchEnd": "2025",
                                "createdAt": "2024-04-27T13:55:54.000Z",
                                "studentStatus": "1"
                            }
                            */
                            secureLocalStorage.setItem("vc_m", JSON.stringify(data["studentData"]));
                            secureLocalStorage.setItem("vc_r", "S");

                            router.push('/s');
                            break;
                        case "M":
                            secureLocalStorage.setItem("vc_t", data["SECRET_TOKEN"]);
                            // console.log(data["managerData"]);
                            /*
                            {
                                "managerId": 4,
                                "managerFullName": "ASHWIN NARAYANAN S",
                                "managerEmail": "ashrockzzz2003@gmail.com",
                                "deptId": 1,
                                "deptName": "CSE",
                                "roleId": 4,
                                "createdAt": "2024-04-27T13:55:54.000Z",
                                "managerStatus": "1"
                            }
                            */
                            secureLocalStorage.setItem("vc_m", JSON.stringify(data["managerData"]));

                            const whoAmI = data["managerData"]["roleId"];

                            switch (whoAmI) {
                                case 1:
                                    secureLocalStorage.setItem("vc_r", "A");
                                    router.push('/a');
                                    break;
                                case 2:
                                    secureLocalStorage.setItem("vc_r", "D");
                                    router.push('/d');
                                    break;
                                case 3:
                                    secureLocalStorage.setItem("vc_r", "O");
                                    router.push('/o');
                                    break;
                                case 4:
                                    secureLocalStorage.setItem("vc_r", "P");
                                    router.push('/p');
                                    break;
                                default:
                                    buildDialog('Unauthorized', 'Access Denied', 'Okay');
                                    openModal();
                                    break;
                            }

                            break;

                        default:
                            buildDialog('Unauthorized', 'Access Denied', 'Okay');
                            openModal();
                            break;
                    }
                });
            } else if (res.status == 400) {
                res.json().then((data) => {
                    buildDialog('Unauthorized', data['message'] ?? "Invalid Email/Password", 'Okay');
                    openModal();
                });
            } else {
                buildDialog('Error', 'An error occured while trying to login', 'Okay');
                openModal();
            }

        }).catch((err) => {
            buildDialog('Error', 'An error occured while trying to login', 'Okay');
            openModal();
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        setUserEmail('');
        setUserPassword('');
    }, []);

    return <>
        <NavBar />
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
                        <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Sign In</h1>
                    </div>
                    <hr className='border-[#cdcdcd] w-full' />
                </div>

                <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Email ID
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder='Enter your registered Email ID'
                                    onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
                                    className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                        (!isValidEmail && userEmail ? ' ring-[#ffb3b3]' : isValidEmail && userEmail ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-black">
                                    Password
                                </label>
                                <div className="text-md">
                                    <Link replace={true} href={"/auth/forgot-password"} className="text-[#000000] hover:underline italic">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder='Enter your Password'
                                    className={"block bg-white text-lg w-full rounded-md border-0 py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" + (!isValidPassword && userPassword ? ' ring-[#ffb3b3]' : isValidPassword && userPassword ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* <div className="mt-10 text-center text-gray-800 flex flex-row justify-center items-center">
                            <p>{"Don't have an account?"}</p>
                            <Link className="text-[#000000] hover:underline italic ml-4" href="/auth/register">Register</Link>
                        </div> */}

                        <div>
                            {isLoading == false ? <input
                                value="Sign In"
                                type="submit"
                                disabled={(!isValidEmail || !isValidPassword)}
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
        <DialogModal
            isOpen={isOpen}
            closeModal={closeModal}
            title={title}
            message={message}
            buttonLabel={buttonLabel}
        />
    </>;
}
