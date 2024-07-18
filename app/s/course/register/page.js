"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { STUDENT_CAN_REGISTER_URL, STUDENT_REGISTER_COURSE_URL } from "@/components/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function AllCoursesPage() {

    const [studentData, setStudentData] = useState(null);

    useEffect(() => {
        const data = JSON.parse(secureLocalStorage.getItem("vc_m"));
        setStudentData(data);
    }, []);

    const [isLoading, setIsLoading] = useState(true);
    // For The AlertDialogModal
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState('');

    const [searchText, setSearchText] = useState('');

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

    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        fetch(STUDENT_CAN_REGISTER_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t")
            },
        }).then((res) => {

            if (res.status === 200) {
                res.json().then((data) => {
                    setData(data["data"]);
                    setFilteredData(data["data"]);
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


    useEffect(() => {
        if (data !== null) {
            setFilteredData(data.filter((course) => {
                return searchText === "" || course.deptName.toLowerCase().includes(searchText.toLowerCase()) || course.courseName.toLowerCase().includes(searchText.toLowerCase()) || course.courseCode.toLowerCase().includes(searchText.toLowerCase());
            }));
        }
    }, [searchText]);


    const registerToCourse = (classRoomId) => {
        setIsLoading(true);

        fetch(STUDENT_REGISTER_COURSE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("vc_t")}`
            },
            body: JSON.stringify({
                classroomId: classRoomId,
            }),
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    buildDialog("Success", "Successfully registered to course", "Close");
                    openModal();

                    setTimeout(() => {
                        router.push('/s');
                    }, 2000);
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
                buildDialog("Error", "Failed to create new course", "Close");
                openModal();
            }
        }).catch((err) => {
            buildDialog("Error", "Failed to create new course", "Close");
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
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center">
                    <h1 className="text-4xl font-bold mt-0">Welcome, {studentData["studentName"] ?? ""}</h1>
                    <p className="text-lg font-light mt-0">{new Date().toDateString()}</p>
                    <h1 className="text-2xl font-bold mt-4">Register to Courses</h1>

                    {/* search bar */}
                    <input
                        type="text"
                        placeholder="Search for a course"
                        className="w-[64%] mt-4 p-2 border border-[#cdcdcd] rounded-2xl"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />

                    {(filteredData === null || filteredData.length === 0) && !isLoading ? (
                        <p className="text-lg font-light mt-4">No courses found to register</p>
                    ) : null}

                    <div className="flex flex-row flex-wrap gap-4 mt-4 hover:cursor-pointer justify-center items-center">
                        {filteredData !== null && filteredData.map((course, index) => (
                            <div key={index} className="backdrop-blur-xl bg-[#f9f9f9] bg-opacity-40 shadow-sm p-4 rounded-xl border border-[#cdcdcd] hover:rounded-2xl hover:bg-[#ffffff]">
                                <h2 className="text-lg font-bold">{course.courseName}</h2>
                                <p className="text-sm font-light">{course.courseCode}</p>
                                <div className="flex justify-between items-start mt-2">
                                    <button onClick={() => {
                                        registerToCourse(course.classroomId)
                                    }} className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer">Register to Course</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24">
                        <Link href="/s" className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-fit text-center border-[#cdcdcd] hover:cursor-pointer">Back to Dashboard</Link>
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