"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { ALL_COURSES_URL } from "@/components/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function AllCoursesPage() {

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
        fetch(ALL_COURSES_URL, {
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


    return (
        <>
            <NavBar />

            {isLoading ? <LoadingScreen /> : (
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center">
                    <p className="text-lg font-light mt-0">{new Date().toDateString()}</p>
                    <h1 className="text-2xl font-bold mt-4">All Courses</h1>

                    {/* button to add new course */}
                    <Link href="/d/course/new" className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-[64%] text-center border-[#cdcdcd] hover:cursor-pointer">Add New Course</Link>

                    {/* search bar */}
                    <input
                        type="text"
                        placeholder="Search for a course"
                        className="w-[64%] mt-4 p-2 border border-[#cdcdcd] rounded-2xl"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />

                    {filteredData === null && !isLoading ? (
                        <p className="text-lg font-light mt-4">No courses found</p>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 hover:cursor-pointer justify-center items-center">
                        {filteredData !== null && filteredData.map((course, index) => (
                            <div key={index} className="backdrop-blur-xl bg-[#f9f9f9] bg-opacity-40 shadow-sm p-4 rounded-xl border border-[#cdcdcd] hover:rounded-2xl hover:bg-[#ffffff]">
                                <h2 className="text-lg font-bold">{course.courseName}</h2>
                                <p className="text-sm font-light">{course.courseCode} | {course.deptName}</p>
                                <div className="flex justify-between items-start mt-2">
                                    <Link href={`/d/course/${course.courseId}`} className="mt-2 bg-gray-200 text-black px-4 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer">View Course</Link>
                                    <Link href={`/d/course/${course.courseId}/edit`} className="mt-2 bg-gray-200 text-black px-4 ml-2 py-2 rounded-2xl border w-full text-center border-[#cdcdcd] hover:cursor-pointer">Edit Course</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24">

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