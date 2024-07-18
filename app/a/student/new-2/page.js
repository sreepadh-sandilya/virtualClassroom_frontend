"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_DEPARTMENTS_URL, NEW_STUDENT_URL } from "@/components/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function RegisterStudents() {

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

    const [departmentData, setDepartmentData] = useState([]);
    const [courseDeptId, setCourseDeptId] = useState('-1');
    const [studentName, setStudentName] = useState('');
    const [studentRollNumber, setStudentRollNumber] = useState('');
    const [studentGender, setStudentGender] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentDob, setStudentDob] = useState('');
    const [studentSection, setStudentSection] = useState('');
    const [studentBatchStart, setStudentBatchStart] = useState('');
    const [studentBatchEnd, setStudentBatchEnd] = useState('');

    const isValidStudentName = studentName.length > 0;
    const isValidStudentRollNumber = studentRollNumber.length > 0;
    const isValidStudentGender = studentGender.length === 1;
    const isValidStudentPhone = studentPhone.length === 10;
    const isValidStudentEmail = studentEmail.length > 0;
    const isValidStudentDob = studentDob.length === 10;
    const isValidStudentSection = studentSection.length === 1;
    const isValidStudentBatchStart = studentBatchStart.length === 4 && !isNaN(studentBatchStart);
    const isValidStudentBatchEnd = studentBatchEnd.length === 4 && !isNaN(studentBatchEnd);
    const isValidCourseDeptId = courseDeptId !== '-1' && courseDeptId.length > 0;

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
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
                });
            } else {
                buildDialog("Error", "Failed to fetch departments", "Close");
            }

        }).catch((err) => {

            buildDialog("Error", "Failed to fetch departments", "Close");

        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    const handleCreateNew = async (e) => {
        e.preventDefault();

        /*
        studentData: [
                    {
                        "studentName": "string",
                        "studentRollNumber": "string",
                        "studentGender": "string",
                        "studentPhone": "string",
                        "studentEmail": "string",
                        "studentDob": "string",
                        "studentDeptId": "string",
                        "studentSection": "string",
                        "studentBatchStart": "string",
                        "studentBatchEnd": "string"
                    },
                    ...
                ]
        */

        const studentData = [{
            "studentName": studentName,
            "studentRollNumber": studentRollNumber,
            "studentGender": studentGender,
            "studentPhone": studentPhone,
            "studentEmail": studentEmail,
            "studentDob": studentDob,
            "studentDeptId": courseDeptId,
            "studentSection": studentSection,
            "studentBatchStart": studentBatchStart,
            "studentBatchEnd": studentBatchEnd
        }];

        fetch(NEW_STUDENT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + secureLocalStorage.getItem("vc_t"),
            },
            body: JSON.stringify({
                "studentData": studentData
            }),
        }).then((res) => {
            if (res.status == 200) {

                buildDialog("Success", "Student registered successfully", "Close");
                openModal();

                setTimeout(() => {
                    router.push("/a");
                }, 2000);

            } else if (res.status == 400) {
                res.json().then((data) => {
                    buildDialog("Error", data.message, "Close");
                    openModal();
                });
            } else {
                buildDialog("Error", "Failed to register students", "Close");
                openModal();
            }
        }).catch((err) => {
            buildDialog("Error", "Failed to register students", "Close");
            openModal();
        }).finally(() => {
            setIsLoading(false);
        });

    }

    return (
        <>
            <NavBar />

            {isLoading ? <LoadingScreen /> : (
                <main className="flex min-h-[80vh] flex-1 flex-col justify-center my-8">
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
                                <h1 className='px-4 py-4 w-full text-2xl font-semibold text-center text-black'>Register Student</h1>
                            </div>
                            <hr className='border-[#cdcdcd] w-full' />
                        </div>


                        <div className="mt-10 mx-auto w-full sm:max-w-11/12 md:max-w-md lg:max-w-md px-6 pb-8 lg:px-8 ">
                            <form className="space-y-6" onSubmit={handleCreateNew}>
                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Department That Students belong to
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidCourseDeptId && courseDeptId > 0 ? ' ring-[#ffb3b3]' : isValidCourseDeptId && courseDeptId > 0 ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            onChange={(e) => setCourseDeptId(e.target.value)}
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
                                        Student Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            autoComplete="studentName"
                                            placeholder='Enter Student Name'
                                            onChange={(e) => setStudentName(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentName && studentName ? ' ring-[#ffb3b3]' : isValidStudentName && studentName ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Roll Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            autoComplete="studentRollNumber"
                                            placeholder='Enter Student Roll Number'
                                            onChange={(e) => setStudentRollNumber(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentRollNumber && studentRollNumber ? ' ring-[#ffb3b3]' : isValidStudentRollNumber && studentRollNumber ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            autoComplete="studentEmail"
                                            placeholder='Enter Student Email'
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentEmail && studentEmail ? ' ring-[#ffb3b3]' : isValidStudentEmail && studentEmail ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Phone
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            autoComplete="studentPhone"
                                            placeholder='Enter Student Phone'
                                            onChange={(e) => setStudentPhone(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentPhone && studentPhone ? ' ring-[#ffb3b3]' : isValidStudentPhone && studentPhone ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Gender
                                    </label>

                                    <div className="mt-2">
                                        <select
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentGender && studentGender ? ' ring-[#ffb3b3]' : isValidStudentGender && studentGender ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            onChange={(e) => setStudentGender(e.target
                                                .value)}

                                        >

                                            <option value="">Select</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                </div>


                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student DOB
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            autoComplete="studentDob"
                                            placeholder='Enter Student Dob (YYYY-MM-DD)'
                                            onChange={(e) => setStudentDob(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentDob && studentDob ? ' ring-[#ffb3b3]' : isValidStudentDob && studentDob ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>


                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Section
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            autoComplete="studentSection"
                                            placeholder='Enter Student Section'
                                            onChange={(e) => setStudentSection(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentSection && studentSection ? ' ring-[#ffb3b3]' : isValidStudentSection && studentSection ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>


                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Batch Start
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            autoComplete="studentBatchStart"
                                            placeholder='Enter Student Batch Start (YYYY)'
                                            onChange={(e) => setStudentBatchStart(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentBatchStart && studentBatchStart ? ' ring-[#ffb3b3]' : isValidStudentBatchStart && studentBatchStart ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-md font-medium leading-6 text-black">
                                        Student Batch End
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            autoComplete="studentBatchEnd"
                                            placeholder='Enter Student Batch End (YYYY)'
                                            onChange={(e) => setStudentBatchEnd(e.target.value)}
                                            className={"block bg-white text-lg w-full rounded-md py-2 px-2 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-500 sm:text-md sm:leading-6 !outline-none" +
                                                (!isValidStudentBatchEnd && studentBatchEnd ? ' ring-[#ffb3b3]' : isValidStudentBatchEnd && studentBatchEnd ? ' ring-[#c5feb3]' : ' ring-transparent')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    {isLoading == false ? <input
                                        value="Register Students"
                                        type="submit"
                                        disabled={!isValidCourseDeptId}
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