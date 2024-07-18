"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { STUDENT_GET_QUIZ_URL, STUDENT_SUBMIT_QUIZ_URL } from "@/components/api";
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
        fetch(STUDENT_GET_QUIZ_URL, {
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
            } else if (res.status === 400) {
                res.json().then((data) => {
                    buildDialog("Error", data["message"], "Close");
                    openModal();
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

    const submitQuiz = () => {

        let submissionData = [];

        for(let i = 0; i < quizData["quizData"].length; i++) {
            const question = quizData["quizData"][i];
            const questionElement = document.getElementById(`q_${i}`);

            if(question["type"] === "fill_in") {
                const answer = questionElement.querySelector("input[type=text]").value;
                if(answer === "") {
                    buildDialog("Error", "Please fill in all the answers", "Close");
                    openModal();
                    return;
                }

                submissionData.push({
                    "answer": answer,
                    "question": question["question"],
                });

            } else if(question["type"] === "mcq") {
                const answer = questionElement.querySelector("input[type=radio]:checked");
                if(answer === null) {
                    buildDialog("Error", "Please fill in all the answers", "Close");
                    openModal();
                    return;
                }

                submissionData.push({
                    "answer": answer.value,
                    "question": question["question"],
                });
            } else {
                const answer = questionElement.querySelectorAll("input[type=checkbox]:checked");
                if(answer.length === 0) {
                    buildDialog("Error", "Please fill in all the answers", "Close");
                    openModal();
                    return;
                }

                let answers = [];
                answer.forEach((element) => {
                    answers.push(element.value);
                });

                submissionData.push({
                    "answer": answers,
                    "question": question["question"],
                });
            }
        }

        if (submissionData.length !== quizData["quizData"].length) {
            buildDialog("Error", "Please fill in all the answers", "Close");
            openModal();
            return;
        }

        setIsLoading(true);

        fetch(STUDENT_SUBMIT_QUIZ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t")
            },
            body: JSON.stringify({
                "quizId": quizId,
                "quizSubmissionData": submissionData,
                "classroomId": classroomId
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {

                    buildDialog("Quiz Submitted Successfully", `Marks: ${data["marks"]}`, "Close");
                    openModal();
                });

            } else if (res.status === 400) {
                res.json().then((data) => {
                    buildDialog("Error", data["message"], "Close");
                    openModal();
                });
            } else {
                buildDialog("Error", "Failed to submit quiz", "Close");
                openModal();
            }

        }).catch((err) => {
            buildDialog("Error", "Failed to submit quiz", "Close");
            openModal();

        }).finally(() => {
            setIsLoading(false);
        });

    }


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
                                    <div id={`q_${index}`} key={index} className='border border-[#cdcdcd] rounded-lg p-4 mt-2'>
                                        <p className="text-sm text-gray-600 mb-2 mt-0">Marks: {question["marks"]}</p>
                                        {question["type"] === "fill_in" ? (
                                            <div>
                                                <p className="text-lg font-semibold">{question["question"]}</p>
                                                <p className="text-sm text-gray-600">Enter your answer below</p>
                                                <input type="text" className="mt-2 p-2 border border-[#cdcdcd] rounded-lg w-full" />
                                            </div>
                                        ) : question["type"] === "mcq" ? (
                                            <div>
                                                <p className="text-lg font-semibold">{question["question"]}</p>
                                                <p className="text-sm text-gray-600">Select the correct answer below</p>
                                                <div className="mt-2">
                                                    {question["options"].map((option, index) => (
                                                        <div key={index} className="flex items-center mt-2">
                                                            <input type="radio" name={question["question"]} id={option} value={(index + 1).toString()} />
                                                            <label htmlFor={option} className="ml-2">{option}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-lg font-semibold">{question["question"]}</p>
                                                <p className="text-sm text-gray-600">Select the correct answer below</p>
                                                <div className="mt-2">
                                                    {question["options"].map((option, index) => (
                                                        <div key={index} className="flex items-center mt-2">
                                                            <input type="checkbox" name={question["question"]} id={option} value={(index + 1).toString()} />
                                                            <label htmlFor={option} className="ml-2">{option}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer" onClick={submitQuiz} >Submit Quiz</button>
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