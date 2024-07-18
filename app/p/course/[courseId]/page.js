"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_COURSE_URL_PREFIX } from "@/components/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function CoursePage() {
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
    const { courseId } = useParams();

    const [data, setData] = useState(null);
    const [facData, setFacData] = useState(null);

    useEffect(() => {
        fetch(`${GET_COURSE_URL_PREFIX}/${courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t")
            },
        }).then((res) => {

            if (res.status === 200) {
                res.json().then((data) => {
                    setData(data["data"]);

                    const classroomData = data["classrooms"];

                    // group batchwise. there's a batchStart and batchEnd. group by "batchStart_batchEnd"
                    const groupedClassrooms = classroomData.reduce((acc, obj) => {
                        const key = obj.batchStart + "_" + obj.batchEnd;
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(obj);
                        return acc;
                    }, {});

                    console.log(groupedClassrooms);

                    setFacData(groupedClassrooms);

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


    return (
        <>
            <NavBar />

            {isLoading || data === null || !data.length > 0 ? <LoadingScreen /> : (
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center">
                    <p className="text-lg font-light mt-0">{new Date().toDateString()}</p>
                    <h1 className="text-2xl font-bold mt-4">{data[0]["courseName"]}</h1>
                    <h4 className="text-lg font-bold mt-1">{data[0]["courseCode"]} | {data[0]["deptName"]}</h4>

                    {/* Batch Wise Data Displayed */}

                    {Object.keys(facData).map((key) => {
                        return (
                            <div key={key} className="mt-4">
                                <h2 className="text-lg font-bold">{key.split("_")[0]} - {key.split("_")[1]} Batch</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {facData[key].map((classroom) => {
                                        return (
                                            <div key={classroom["classroomId"]} className="bg-white border border-[#cdcdcd] p-4 rounded-xl">
                                                <h3 className="text-lg font-bold">Section: {classroom["section"]}</h3>
                                                <p className="text-md font-light mt-4">Professor</p>
                                                <p className="text-sm font-light text-gray-600">{classroom["managerFullName"]}</p>
                                                <p className="text-sm font-light text-gray-600">{classroom["managerEmail"]}</p>
                                                <p className="text-xs font-light mb-6">{classroom["isMentor"]=="1" ? "Course Mentor" : "Not Mentor"}</p>
                                                <Link href={encodeURI(`/p/course/${courseId}/${classroom["classroomId"]}`)} className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer mr-2">View Class</Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                    

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