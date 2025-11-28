export type Role = "STUDENT" | "TUTOR" | "COORDINATOR";

export interface User {
  userId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: Role;
  ssoToken?: string;
  isActive?: boolean;
}

export interface Student extends User {
  major?: string;
  gpa?: number;
  enrolledCourses?: string[];
}

export interface Tutor extends User {
  expertiseAreas?: string[];
  biography?: string;
  averageRating?: number;
}

export type SessionMode = "ONLINE" | "IN_PERSON";
export type SessionStatus =
  | "PENDING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELED"
  | "RESCHEDULED";

export interface Session {
  sessionId: string;
  meetingLink?: string;
  location?: string;
  student?: Student;
  tutor?: Tutor;
  topic?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  mode?: SessionMode;
  status?: SessionStatus;
  evaluationId?: string;
  evaluationSubmitted?: boolean;
}

export type AvailabilityStatus = "AVAILABLE" | "BOOKED";

export interface AvailabilitySlot {
  slotId: string;
  tutor?: Tutor;
  startTime?: string;
  endTime?: string;
  isRecurring?: boolean;
  status?: AvailabilityStatus;
}

export type MatchingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface MatchingRequest {
  requestId: string;
  student?: Student;
  tutor?: Tutor;
  subject?: string;
  preferredTimeSlots?: string[];
  status?: MatchingStatus;
  createdDate?: string;
}

export interface Resource {
  resourceId: string;
  title?: string;
  description?: string;
  externalLibraryId?: string;
  linkURL?: string;
  addedByTutor?: Tutor;
  session?: Session;
}

export interface Evaluation {
  evaluationId: string;
  session?: Session;
  student?: Student;
  ratingQuality?: number;
  satisfactionLevel?: number;
  comment?: string;
  submittedDate?: string;
}

export type ReportType =
  | "SESSION_HISTORY"
  | "TUTOR_PERFORMANCE"
  | "STUDENT_ACTIVITY";

export interface Report {
  reportId: string;
  type?: ReportType;
  generatedDate?: string;
  content?: string;
}

export interface ProgressNote {
  noteId: string;
  session?: Session;
  tutor?: Tutor;
  student?: Student;
  content?: string;
  createdAt?: string;
}

export type ForumPostStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export interface ForumPost {
  postId: string;
  author?: User;
  title?: string;
  content?: string;
  status?: ForumPostStatus;
  createdDate?: string;
}

export interface ForumReply {
  replyId: string;
  post?: ForumPost;
  author?: User;
  content?: string;
  createdDate?: string;
}

export interface LoginResponse {
  token: string;
}
