"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { EDIT_COURSE_URL, GET_COURSE_URL_PREFIX, GET_DEPARTMENTS_URL } from "@/components/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function EditCourse() {
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
    const { courseId } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [courseType, setCourseType] = useState("-1");
    const [courseDeptId, setCourseDeptId] = useState(-1);

    const courseTypeOptions = [
        {
            "type": "Regular",
            "value": "1"
        },
        {
            "type": "Non-Professional Elective",
            "value": "2"
        },
        {
            "type": "Professional Elective",
            "value": "3"
        }
    ];

    const isValidCourseCode = courseCode.length > 0;
    const isValidCourseName = courseName.length > 0;
    const isValidCourseType = courseType.length === 1 && ["1", "2", "3"].includes(courseType);
    const isValidCourseDeptId = courseDeptId > 0;

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


                    fetch(`${GET_COURSE_URL_PREFIX}/${courseId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${secureLocalStorage.getItem("vc_t")}`,
                        },
                    }).then((res) => {
                        if (res.status === 200) {
                            res.json().then((data) => {

                                if (data["data"].length === 0) {
                                    buildDialog("Error", "Course not found", "Close");
                                    openModal();
                                    // redirect
                                    router.push('/o/course');
                                } else {
                                    setCourseCode(data["data"][0]["courseCode"]);
                                    setCourseName(data["data"][0]["courseName"]);
                                    setCourseType(data["data"][0]["courseType"]);
                                    setCourseDeptId(data["data"][0]["courseDeptId"]);
                                }
                            });
                        } else {
                            buildDialog("Error", "Failed to fetch departments", "Close");
                        }
                    }).catch((err) => {
                        buildDialog("Error", "Failed to fetch departments", "Close");

                    }).finally(() => {
                        setIsLoading(false);
                    });
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

        console.log(courseCode, courseName, courseType, courseDeptId);
        console.log(secureLocalStorage);

        fetch(EDIT_COURSE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${secureLocalStorage.getItem("vc_t")}`
            },
            body: JSON.stringify({
                courseId: courseId.toString().trim(),
                courseCode: courseCode.toString().toUpperCase().trim(),
                courseName: courseName.toString().trim(),
                courseType: courseType.toString().trim(),
                courseDeptId: courseDeptId.toString().trim()
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
                    // setCourseDeptId(-1);

                    // redirect
                    router.push('/o/course');
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
                            <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Edit Course</h1>
                        </div>
                        <hr className='border-[#cdcdcd] w-full' />
                    </div>


                    <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                        <form className="space-y-6" onSubmit={handleCreateNewCourse}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Course Code
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="courseCode"
                                        value={courseCode}
                                        placeholder='Enter Course Code'
                                        onChange={(e) => setCourseCode(e.target.value)}
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidCourseCode && courseCode ? ' ring-[#ffb3b3]' : isValidCourseCode && courseCode ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Course Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        autoComplete="courseName"
                                        value={courseName}
                                        placeholder='Enter Course Name'
                                        onChange={(e) => setCourseName(e.target.value)}
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidCourseName && courseName ? ' ring-[#ffb3b3]' : isValidCourseName && courseName ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-md font-medium leading-6 text-black">
                                    Department Offering the course
                                </label>
                                <div className="mt-2">
                                    <select
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidCourseDeptId && courseDeptId > 0 ? ' ring-[#ffb3b3]' : isValidCourseDeptId && courseDeptId > 0 ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        onChange={(e) => setCourseDeptId(e.target.value)}
                                        value={courseDeptId}
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
                                    Course Type
                                </label>
                                <div className="mt-2">
                                    <select
                                        className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                            (!isValidCourseType && courseType.length === 1 && ["1", "2", "3"].includes(courseType) ? ' ring-[#ffb3b3]' : isValidCourseType && courseType.length === 1 && ["1", "2", "3"].includes(courseType) ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                        onChange={(e) => setCourseType(e.target.value)}
                                        value={courseType}
                                    >
                                        <option value="-1">Select Course Type</option>
                                        {courseTypeOptions.map((type, index) => (
                                            <option key={index} value={type.value}>{type.type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                <input type="button" value="Cancel" onClick={() => router.push('/o/course')} className="w-full mr-2 text-lg rounded-lg bg-white text-black p-2 cursor-pointer" />
                                {isLoading == false ? <input
                                    value="Update"
                                    type="submit"
                                    disabled={(isValidCourseCode && isValidCourseName && isValidCourseType && isValidCourseDeptId) ? false : true}
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