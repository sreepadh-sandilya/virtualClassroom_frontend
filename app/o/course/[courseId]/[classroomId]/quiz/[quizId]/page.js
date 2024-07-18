"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_QUIZ_URL } from "@/components/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";


export default function QuizPage() {

    const [isLoading, setIsLoading] = useState(true);
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

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const router = useRouter();

    const [quizData, setQuizData] = useState(null);

    const { courseId, classroomId, quizId } = useParams();

    useEffect(() => {
        fetch(GET_QUIZ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t")
            },
            body: JSON.stringify({
                "classroomId": classroomId,
                "quizId": quizId
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setQuizData(data["data"][0]);

                    console.log(data["data"][0]);
                });
            } else {
                buildDialog("Error", "Failed to fetch classes", "Close");
                openModal();
            }

        }).catch((err) => {
            buildDialog("Error", "Failed to fetch classes", "Close");
            openModal();

        }).finally(() => {
            setIsLoading(false);
        });
    }, []);



    return (
        <>
            <NavBar />

            {isLoading || quizData === null ? <LoadingScreen /> : (
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center mb-16">
                    {/* Content */}

                    <h1 className="text-3xl font-bold text-center">{quizData["quizName"]}</h1>
                    <p className="text-lg text-center mb-4">{quizData["quizDescription"]}</p>

                    <p className="text-sm text-center text-gray-600 mb-4">{new Date(quizData["startTime"]).toLocaleString()} to {new Date(quizData["endTime"]).toLocaleString()}</p>

                    {quizData["quizData"].length > 0 && (
                        <div>
                            <label className="block text-md font-medium leading-6 text-black">
                                Quiz Questions
                            </label>
                            <div className="mt-2">
                                {quizData["quizData"].map((question, index) => (
                                    <div key={index} className='border border-[#cdcdcd] rounded-lg p-4 mt-2'>
                                        <h3 className='text-lg font-semibold text-black'>{question.question}</h3>
                                        <p className='text-md text-black'>Marks: {question.marks}</p>
                                        {question.correct_answer && (
                                            <p className='text-md text-black'>Correct Answer: {question.correct_answer}</p>
                                        )}
                                        {question.options && (
                                            <div>
                                                <h4 className='text-md font-semibold text-black'>Options</h4>
                                                {question.options.map((option, index) => (
                                                    <p key={index} className='text-md text-black'>{index + 1}. {option}</p>
                                                ))}
                                            </div>
                                        )}
                                        {question.correct_option && (
                                            <p className='text-md text-black'>Correct Option: {question.correct_option}</p>
                                        )}
                                        {question.correct_options && (
                                            <div>
                                                <h4 className='text-md font-semibold text-black'>Correct Options</h4>
                                                {question.correct_options.map((option, index) => (
                                                    <p key={index} className='text-md text-black'>{index + 1}. {option}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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