"use client";
import { useState } from 'react';
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DialogModal from "@/components/DialogModal";
import { FORGOT_PASSWORD_URL } from '@/components/api';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordRequest() {
    const [email, setEmail] = useState('');
    const isValidEmail = typeof email === 'string' && email.length > 0;

    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const router = useRouter();


    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const handleRequestOTP = async (e) => {
        e.preventDefault();

        fetch(FORGOT_PASSWORD_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userEmail": email.toString().trim(),
            }),
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data);
                    // buildDialog("Success", "New department created successfully", "Close");
                    // openModal();

                    secureLocalStorage.setItem("email", email);
                    secureLocalStorage.setItem("token", data["SECRET_TOKEN"]);

                    router.push("/auth/forgot-password/verify");
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
    };

    return (
        <>
            <NavBar />
            <main className="flex min-h-[80vh] flex-1 flex-col justify-center mt-4 md:mt-0">
                <div className="border border-[#cdcdcd] rounded-2xl mx-auto w-11/12 sm:max-w-11/12 md:max-w-md lg:max-w-md backdrop-blur-xl bg-[#f9f9f9] bg-opacity-40 shadow-sm">
                    <div className="mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md">
                        <div className='flex flex-row justify-center'>
                            <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Forgot Password</h1>
                        </div>
                        <hr className='border-[#cdcdcd] w-full' />
                    </div>
                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8">
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            <div>
                                <input
                                    type="submit"
                                    disabled={!isValidEmail}
                                    value="Send OTP"
                                    className="w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                                />
                            </div>
                            <div className="text-center text-sm mt-4">
                                Remembered your password? <Link href="/auth/login" className="text-[#000000] hover:underline italic">Sign in</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <DialogModal
                isOpen={isOpen}
                closeModal={closeModal}
                title={title}
                message={modalMessage}
                buttonLabel={buttonLabel}
            />
        </>
    );
}
