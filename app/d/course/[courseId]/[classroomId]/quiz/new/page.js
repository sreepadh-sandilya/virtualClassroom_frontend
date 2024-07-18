"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { NEW_CLASS_URL, NEW_QUIZ_URL } from "@/components/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function NewQuiz() {
    const { courseId, classroomId } = useParams();

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

    const [isLoading, setIsLoading] = useState(false);

    const [quizName, setQuizName] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizStartTime, setQuizStartTime] = useState(''); // 2021-09-01T10:00:00
    const [quizEndTime, setQuizEndTime] = useState(''); // 2021-09-01T12:00:00

    const [quizQuestions, setQuizQuestions] = useState([]);

    /*
    "fill_in" : {
        "question": "string",
        "correct_answer": "input_string",
        "marks": "int"
    }

    "mcq": {
        "question": "string",
        "options": ["option1", "option2", "option3", "option4", ... ],
        "correct_option": "option1",
        "marks": "int"
    }

    "mcq_multiple": {
        "question": "string",
        "options": ["option1", "option2", "option3", "option4", ...],
        "correct_options": ["option1", "option2"],
        "marks": "int"
    }
    */

    const addNewQuestion = (questionType) => {
        if (questionType === "fill_in") {
            let question = prompt("Enter the question");
            let correctAnswer = prompt("Enter the correct answer");
            let marks = prompt("Enter the marks");

            if (question && correctAnswer && marks) {
                setQuizQuestions([...quizQuestions, {
                    "type": "fill_in",
                    "question": question,
                    "correct_answer": correctAnswer,
                    "marks": marks
                }]);
            }
        } else if (questionType === "mcq") {
            let question = prompt("Enter the question");
            let numberOfOptions = prompt("Enter the number of options");
            let options = [];

            for (let i = 0; i < numberOfOptions; i++) {
                options.push(prompt("Enter option " + (i + 1)));
            }

            let correctOption = prompt("Enter the correct option number");
            let marks = prompt("Enter the marks");

            if (question && options && correctOption && marks) {
                setQuizQuestions([...quizQuestions, {
                    "type": "mcq",
                    "question": question,
                    "options": options,
                    "correct_option": correctOption,
                    "marks": marks
                }]);
            }
        } else if (questionType === "mcq_multiple") {
            let question = prompt("Enter the question");
            let numberOfOptions = prompt("Enter the number of options");
            let options = [];

            for (let i = 0; i < numberOfOptions; i++) {
                options.push(prompt("Enter option " + (i + 1)));
            }

            let numberOfCorrectOptions = prompt("Enter the number of correct options");
            let correctOptions = [];

            for (let i = 0; i < numberOfCorrectOptions; i++) {
                correctOptions.push(prompt("Enter correct option number " + (i + 1)));
            }

            let marks = prompt("Enter the marks");

            if (question && options && correctOptions && marks) {
                setQuizQuestions([...quizQuestions, {
                    "type": "mcq_multiple",
                    "question": question,
                    "options": options,
                    "correct_options": correctOptions,
                    "marks": marks
                }]);
            }
        }

    }

    const isValidQuizStartTime = quizStartTime.length > 0;
    const isValidQuizEndTime = quizEndTime.length > 0;
    const isValidQuizName = quizName.length > 0;
    const isValidQuizDescription = quizDescription.length > 0;

    const buildDialog = (title, message, buttonLabel) => {
        setTitle(title);
        setMessage(message);
        setButtonLabel(buttonLabel);
    }

    const handleCreateNew = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        console.log({
            quizName: quizName,
            classroomId: classroomId,
            quizDescription: quizDescription,
            startTime: quizStartTime,
            endTime: quizEndTime,
            quizData: quizQuestions
        });

        fetch(NEW_QUIZ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("vc_t")}`
            },
            body: JSON.stringify({
                quizName: quizName,
                classroomId: classroomId,
                quizDescription: quizDescription,
                startTime: quizStartTime + ":00",
                endTime: quizEndTime + ":00",
                quizData: quizQuestions
            }),
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    console.log(data);
                    // buildDialog("Success", "New department created successfully", "Close");
                    // openModal();

                    // redirect
                    router.push(`/d/course/${courseId}/${classroomId}`);
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
                buildDialog("Error", "Failed to schedule class", "Close");
                openModal();
            }
        }).catch((err) => {
            buildDialog("Error", "Failed to schedule class", "Close");
            openModal();
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        });

    }

    return (
        <>
            <NavBar />

            {isLoading ? <LoadingScreen /> : (
                <main className="flex min-h-[80vh] flex-1 flex-col justify-center mt-8">
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
                                <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>New Quiz</h1>
                            </div>
                            <hr className='border-[#cdcdcd] w-full' />
                        </div>

                        <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Quiz Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            autoComplete="quizName"
                                            placeholder='Enter Quiz Name'
                                            onChange={(e) => setQuizName(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidQuizName && quizName ? ' ring-[#ffb3b3]' : isValidQuizName && quizName ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Quiz Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            type="text"
                                            autoComplete="quizDescription"
                                            placeholder='Enter Quiz Description'
                                            onChange={(e) => setQuizDescription(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidQuizDescription && quizDescription ? ' ring-[#ffb3b3]' : isValidQuizDescription && quizDescription ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Quiz Starts at
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="datetime-local"
                                            autoComplete="quizStartTime"
                                            placeholder='Enter Class Start Time'
                                            onChange={(e) => setQuizStartTime(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidQuizStartTime && quizStartTime ? ' ring-[#ffb3b3]' : isValidQuizStartTime && quizStartTime ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Quiz Ends at
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="datetime-local"
                                            autoComplete="quizEndTime"
                                            placeholder='Enter Class End Time'
                                            onChange={(e) => setQuizEndTime(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidQuizEndTime && quizEndTime ? ' ring-[#ffb3b3]' : isValidQuizEndTime && quizEndTime ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                {quizQuestions.length > 0 && (
                                    <div>
                                        <label className="block text-md font-medium leading-6 text-black">
                                            Quiz Questions
                                        </label>
                                        <div className="mt-2">
                                            {quizQuestions.map((question, index) => (
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

                                                    {/* Remove qn */}
                                                    <button
                                                        onClick={() => {
                                                            let temp = [...quizQuestions];
                                                            temp.splice(index, 1);
                                                            setQuizQuestions(temp);
                                                        }}
                                                        className='bg-red-500 text-white p-1 rounded-lg cursor-pointer mt-2'>
                                                        Remove Question
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Quiz Questions
                                    </label>
                                    <div className="mt-2">
                                        <div className='flex flex-row justify-between gap-2'>
                                            <button
                                                onClick={() => addNewQuestion("fill_in")}
                                                className='bg-black text-white p-1 rounded-lg cursor-pointer w-full'>
                                                Fill in the blanks
                                            </button>
                                            <button
                                                onClick={() => addNewQuestion("mcq")}
                                                className='bg-black text-white p-1 rounded-lg cursor-pointer w-full'>
                                                MCQ
                                            </button>
                                            <button
                                                onClick={() => addNewQuestion("mcq_multiple")}
                                                className='bg-black text-white p-1 rounded-lg cursor-pointer w-full'>
                                                MCQ Multiple
                                            </button>
                                        </div>
                                    </div>
                                </div>



                                <div>
                                    {isLoading == false ? <input
                                        value="Create Quiz"
                                        onClick={handleCreateNew}
                                        type="submit"
                                        disabled={(isValidQuizName && isValidQuizDescription && isValidQuizStartTime && isValidQuizEndTime) ? false : true}
                                        className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-[#d7d7d7] disabled:cursor-not-allowed disabled:text-[#696969] disabled:border disabled:border-[#c8c8c8] "} /> :
                                        <input
                                            value="Loading..."
                                            type="submit"
                                            disabled={true}
                                            className={"w-full text-lg rounded-lg bg-black text-white p-2 cursor-pointer disabled:bg-[#d7d7d7]  disabled:text-[#696969] disabled:cursor-not-allowed disabled:border disabled:border-[#c8c8c8]"} />
                                    }
                                </div>



                            </div>
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
    )


}