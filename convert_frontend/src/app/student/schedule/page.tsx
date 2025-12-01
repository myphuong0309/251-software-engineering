'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentScheduleIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student/schedule/upcoming");
  }, [router]);

  return null;
}
