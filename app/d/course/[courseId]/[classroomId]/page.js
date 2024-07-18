"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_CLASS_ALL_URL } from "@/components/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function ClassPage() {
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
    const { courseId, classroomId } = useParams();

    const [data, setData] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [classRoomData, setClassRoomData] = useState(null);

    useEffect(() => {
        fetch(GET_CLASS_ALL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t")
            },
            body: JSON.stringify({
                "classroomId": classroomId,
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setData(data["data"]);
                    setQuizData(data["quizData"]);
                    setClassRoomData(data["classRoomData"]);
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

            {isLoading || data === null ? <LoadingScreen /> : (
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center">
                    <p className="text-lg font-light mt-0">{new Date().toDateString()}</p>
                    <h1 className="text-2xl font-bold mt-4">{data[0]["courseName"]}</h1>
                    <h4 className="text-lg font-bold mt-1">{data[0]["courseCode"]}</h4>
                    <p className="text-md font-light mt-4">{data[0]["mangerFullName"]}</p>
                    <p className="text-md font-light mt-1">{data[0]["batchStart"]}-{data[0]["batchEnd"]} | {data[0]["section"]} batch</p>

                    {/* Batch Wise Data Displayed */}

                    <div className="flex flex-col mt-8 w-full justify-center items-center">
                        <h1 className="text-lg font-bold">Class Schedule</h1>
                        {/* button to add new course */}
                        <Link href={`/d/course/${courseId}/${classroomId}/schedule-class`} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-fit text-center border-[#cdcdcd] hover:cursor-pointer">Schedule Class</Link>
                        {classRoomData.length === 0 ? <p className="text-md font-light mt-1">No classes scheduled</p> : null}
                        <div className="flex flex-row mt-4 w-full gap-4 justify-center items-center">
                            {classRoomData.map((classData, index) => (
                                <div key={index} className="flex flex-col w-fit border-b-2 bg-white border border-[#cdcdcd] p-2 rounded-2xl">
                                    <p>Session {index + 1}</p>
                                    <p className="text-sm text-gray-600">{new Date(classData["classStartTime"]).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">{new Date(classData["classStartTime"]).toLocaleTimeString()}-{new Date(classData["classEndTime"]).toLocaleTimeString()}</p>
                                    <Link target="_blank" href={classData["classLink"]} className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer">Join Class</Link>
                                    <Link href={
                                        `/d/course/${courseId}/${classroomId}/edit-schedule?classId=${classData["classId"]}&classStartTime=${classData["classStartTime"]}&classEndTime=${classData["classEndTime"]}&classLink=${classData["classLink"]}`
                                    } className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer">Edit Class</Link>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex flex-col mt-16 w-full justify-center items-center mb-32">
                        <h1 className="text-lg font-bold">Quizzes</h1>
                        {/* New Quiz */}
                        <Link href={`/d/course/${courseId}/${classroomId}/quiz/new`} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-fit text-center border-[#cdcdcd] hover:cursor-pointer">New Quiz</Link>
                        {quizData.length === 0 ? <p className="text-md font-light mt-1">No quizzes scheduled</p> : null}
                        <div className="flex flex-row mt-4 w-full gap-4 justify-center items-center">
                            {quizData.map((quiz, index) => (
                                <div key={index} className="flex flex-col w-fit border-b-2 bg-white border border-[#cdcdcd] p-2 rounded-2xl">
                                    <p>Quiz {index + 1}</p>
                                    <p className="text-sm text-gray-600">{new Date(quiz["startTime"]).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">{new Date(quiz["startTime"]).toLocaleTimeString()}-{new Date(quiz["endTime"]).toLocaleTimeString()}</p>
                                    <Link href={`/d/course/${courseId}/${classroomId}/quiz/${quiz["quizId"]}`} className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer">View Quiz</Link>
                                </div>
                            ))}
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