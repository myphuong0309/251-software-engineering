import { apiFetch } from "./api-client";
import {
  AvailabilitySlot,
  Evaluation,
  ForumPost,
  ForumReply,
  LoginResponse,
  MatchingRequest,
  ProgressNote,
  Report,
  Resource,
  Session,
  Tutor,
  User,
} from "@/types/api";

export const api = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  register: (user: Partial<User>) =>
    apiFetch<User>("/auth/register", { method: "POST", body: user }),
  getUser: (userId: string, token?: string) =>
    apiFetch<User>(`/users/${userId}`, { token }),
  updateUser: (userId: string, user: Partial<User>, token?: string) =>
    apiFetch<User>(`/users/${userId}`, { method: "PUT", body: user, token }),
  activateUser: (userId: string, token?: string) =>
    apiFetch<User>(`/users/${userId}/activate`, { method: "PUT", token }),
  deactivateUser: (userId: string, token?: string) =>
    apiFetch<User>(`/users/${userId}/deactivate`, { method: "PUT", token }),
  getUsers: (token?: string) => apiFetch<User[]>("/users", { token }),
  getAllUsers: (token?: string) => apiFetch<User[]>("/users", { token }),
  getTutors: (token?: string) => apiFetch<Tutor[]>("/tutors", { token }),
  getTutorById: (tutorId: string, token?: string) =>
    apiFetch<Tutor>(`/tutors/${tutorId}`, { token }),

  // Matching
  createMatchingRequest: (
    request: Partial<MatchingRequest>,
    token?: string,
  ) =>
    apiFetch<MatchingRequest>("/matching/request", {
      method: "POST",
      body: request,
      token,
    }),
  getMatchingRequestsForStudent: (studentId: string, token?: string) =>
    apiFetch<MatchingRequest[]>(`/matching/student/${studentId}`, { token }),
  getMatchingRequestsForTutor: (tutorId: string, token?: string) =>
    apiFetch<MatchingRequest[]>(`/matching/tutor/${tutorId}`, { token }),
  approveMatchingRequest: (requestId: string, token?: string) =>
    apiFetch<MatchingRequest>(`/matching/approve/${requestId}`, {
      method: "POST",
      token,
    }),
  rejectMatchingRequest: (requestId: string, token?: string) =>
    apiFetch<MatchingRequest>(`/matching/reject/${requestId}`, {
      method: "POST",
      token,
    }),

  // Sessions
  scheduleSession: (session: Partial<Session>, token?: string) =>
    apiFetch<Session>("/sessions/schedule", {
      method: "POST",
      body: session,
      token,
    }),
  getSessionsForStudent: (studentId: string, token?: string) =>
    apiFetch<Session[]>(`/sessions/student/${studentId}`, { token }),
  getSessionsForTutor: (tutorId: string, token?: string) =>
    apiFetch<Session[]>(`/sessions/tutor/${tutorId}`, { token }),
  getSessionById: (sessionId: string, token?: string) =>
    apiFetch<Session>(`/sessions/${sessionId}`, { token }),
  getAllSessions: (token?: string) => apiFetch<Session[]>(`/sessions`, { token }),
  cancelSession: (sessionId: string, token?: string) =>
    apiFetch<Session>(`/sessions/cancel/${sessionId}`, {
      method: "POST",
      token,
    }),
  rescheduleSession: (
    sessionId: string,
    payload: { newStartTime: string; newEndTime: string },
    token?: string,
  ) =>
    apiFetch<Session>(`/sessions/reschedule/${sessionId}`, {
      method: "POST",
      body: payload,
      token,
    }),
  completeSession: (sessionId: string, token?: string) =>
    apiFetch<Session>(`/sessions/complete/${sessionId}`, {
      method: "POST",
      token,
    }),

  // Availability
  createAvailability: (slot: Partial<AvailabilitySlot>, token?: string) =>
    apiFetch<AvailabilitySlot>("/availability", {
      method: "POST",
      body: slot,
      token,
    }),
  getAvailabilityForTutor: (tutorId: string, token?: string) =>
    apiFetch<AvailabilitySlot[]>(`/availability/tutor/${tutorId}`, { token }),
  updateAvailability: (
    slotId: string,
    slot: Partial<AvailabilitySlot>,
    token?: string,
  ) =>
    apiFetch<AvailabilitySlot>(`/availability/${slotId}`, {
      method: "PUT",
      body: slot,
      token,
    }),
  deleteAvailability: (slotId: string, token?: string) =>
    apiFetch<void>(`/availability/${slotId}`, { method: "DELETE", token }),

  // Resources
  addResourceToSession: (resource: Partial<Resource>, token?: string) =>
    apiFetch<Resource>("/resources", {
      method: "POST",
      body: resource,
      token,
    }),
  getResources: (token?: string) => apiFetch<Resource[]>("/resources", { token }),
  getResourceById: (resourceId: string, token?: string) =>
    apiFetch<Resource>(`/resources/${resourceId}`, { token }),
  getResourcesForSession: (sessionId: string, token?: string) =>
    apiFetch<Resource[]>(`/resources/session/${sessionId}`, { token }),
  removeResourceFromSession: (resourceId: string, token?: string) =>
    apiFetch<void>(`/resources/${resourceId}`, {
      method: "DELETE",
      token,
    }),

  // Evaluations
  createEvaluation: (evaluation: Partial<Evaluation>, token?: string) =>
    apiFetch<Evaluation>("/evaluations", {
      method: "POST",
      body: evaluation,
      token,
    }),
  getEvaluationById: (evaluationId: string, token?: string) =>
    apiFetch<Evaluation>(`/evaluations/${evaluationId}`, { token }),
  getEvaluationsForSession: (sessionId: string, token?: string) =>
    apiFetch<Evaluation[]>(`/evaluations/session/${sessionId}`, { token }),
  getEvaluationsByStudent: (studentId: string, token?: string) =>
    apiFetch<Evaluation[]>(`/evaluations/student/${studentId}`, { token }),

  // Reports & progress notes
  generateReport: (report: Partial<Report>, token?: string) =>
    apiFetch<Report>("/reports/generate", { method: "POST", body: report, token }),
  getReport: (reportId: string, token?: string) =>
    apiFetch<Report>(`/reports/${reportId}`, { token }),
  createProgressNote: (note: Partial<ProgressNote>, token?: string) =>
    apiFetch<ProgressNote>("/reports/notes", {
      method: "POST",
      body: note,
      token,
    }),
  getProgressNotesForSession: (sessionId: string, token?: string) =>
    apiFetch<ProgressNote[]>(`/reports/notes/session/${sessionId}`, { token }),

  // Forum
  createPost: (post: Partial<ForumPost>, token?: string) =>
    apiFetch<ForumPost>("/forum/posts", { method: "POST", body: post, token }),
  getAllPosts: (token?: string) => apiFetch<ForumPost[]>("/forum/posts", { token }),
  getPostById: (postId: string, token?: string) =>
    apiFetch<ForumPost>(`/forum/posts/${postId}`, { token }),
  createReply: (reply: Partial<ForumReply>, token?: string) =>
    apiFetch<ForumReply>("/forum/replies", { method: "POST", body: reply, token }),
};
