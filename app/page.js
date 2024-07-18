"use client";

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <>
      <NavBar />
    </>
  );
}
