import {
  AvailabilitySlot,
  MatchingRequest,
  Resource,
  Session,
  SessionMode,
  SessionStatus,
  Student,
  Tutor,
} from "@/types/api";

const now = new Date();
const toISO = (date: Date) => date.toISOString();

export const sampleStudent: Student = {
  userId: "student-1",
  fullName: "Emma Wilson",
  email: "emma.wilson@hcmut.edu.vn",
  role: "STUDENT",
  isActive: true,
  major: "Computer Science",
  gpa: 3.6,
  enrolledCourses: ["CO3001", "CO2003"],
};

export const sampleTutors: Tutor[] = [
  {
    userId: "tutor-1",
    fullName: "Dr. Jane Smith",
    email: "jane.smith@hcmut.edu.vn",
    role: "TUTOR",
    isActive: true,
    expertiseAreas: ["Java", "Databases", "Software Engineering"],
    biography: "Faculty member focused on software architecture and mentoring.",
    averageRating: 4.8,
  },
  {
    userId: "tutor-2",
    fullName: "Prof. Robert Chen",
    email: "robert.chen@hcmut.edu.vn",
    role: "TUTOR",
    isActive: true,
    expertiseAreas: ["Algorithms", "Data Structures", "Python"],
    biography: "Researcher guiding students through algorithmic thinking.",
    averageRating: 4.6,
  },
];

export const sampleSessions: Session[] = [
  {
    sessionId: "session-1",
    topic: "CO3001 – Software Engineering",
    startTime: toISO(new Date(now.getTime() + 24 * 60 * 60 * 1000)),
    endTime: toISO(new Date(now.getTime() + 25.5 * 60 * 60 * 1000)),
    duration: 90,
    mode: "ONLINE" as SessionMode,
    status: "SCHEDULED" as SessionStatus,
    tutor: sampleTutors[0],
    student: sampleStudent,
    meetingLink: "https://meet.example.com/session-1",
  },
  {
    sessionId: "session-4",
    topic: "CO3010 – Software Project",
    startTime: toISO(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
    endTime: toISO(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)),
    duration: 60,
    mode: "ONLINE" as SessionMode,
    status: "SCHEDULED" as SessionStatus,
    tutor: sampleTutors[1],
    student: sampleStudent,
  },
  {
    sessionId: "session-2",
    topic: "CO2003 – Data Structures",
    startTime: toISO(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
    endTime: toISO(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000)),
    duration: 90,
    mode: "IN_PERSON" as SessionMode,
    status: "COMPLETED" as SessionStatus,
    tutor: sampleTutors[1],
    student: sampleStudent,
    location: "Room B1-301",
  },
  {
    sessionId: "session-3",
    topic: "CO1001 – Introduction to Programming",
    startTime: toISO(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
    endTime: toISO(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)),
    duration: 60,
    mode: "ONLINE" as SessionMode,
    status: "COMPLETED" as SessionStatus,
    tutor: sampleTutors[0],
    student: sampleStudent,
    meetingLink: "https://meet.example.com/session-3",
    evaluationId: "evaluation-3",
    evaluationSubmitted: true,
  },
];

export const sampleMatchingRequests: MatchingRequest[] = [
  {
    requestId: "mr-1",
    subject: "Software Engineering",
    status: "PENDING",
    tutor: sampleTutors[0],
    student: sampleStudent,
    preferredTimeSlots: [
      toISO(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)),
      toISO(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
    ],
    createdDate: toISO(now),
  },
];

export const sampleAvailability: AvailabilitySlot[] = [
  {
    slotId: "slot-1",
    startTime: toISO(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)),
    endTime: toISO(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)),
    status: "AVAILABLE",
    isRecurring: false,
  },
  {
    slotId: "slot-2",
    startTime: toISO(new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000)),
    endTime: toISO(new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)),
    status: "BOOKED",
    isRecurring: true,
  },
];

export const sampleResources: Resource[] = [
  {
    resourceId: "res-1",
    title: "Software Engineering Process Overview",
    description: "Slides and reading list for the CO3001 course.",
    linkURL: "https://example.com/resource/1",
    session: sampleSessions[0],
  },
  {
    resourceId: "res-2",
    title: "Algorithms Cheatsheet",
    description: "Short notes for quick revision.",
    linkURL: "https://example.com/resource/2",
    session: sampleSessions[1],
  },
];
