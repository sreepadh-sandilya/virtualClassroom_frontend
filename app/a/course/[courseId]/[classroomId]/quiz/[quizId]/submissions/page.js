"use client";

import DialogModal from "@/components/DialogModal";
import LoadingScreen from "@/components/LoadingScreen";
import NavBar from "@/components/NavBar";
import { GET_SUBMISSIONS_URL } from "@/components/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

export default function QuizSubmissionData() {

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

    const [quizSubmissionData, setQuizSubmissionData] = useState(null);

    const { courseId, classroomId, quizId } = useParams();

    useEffect(() => {
        fetch(GET_SUBMISSIONS_URL, {
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
                    setQuizSubmissionData(data["data"]);
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

            {isLoading || quizSubmissionData === null ? <LoadingScreen /> : (
                <main className="flex flex-1 flex-col mt-24 w-[80%] ml-auto mr-auto items-center justify-center mb-16">
                    {/* Content */}

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