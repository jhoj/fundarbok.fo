import { Document as DocumentModel } from './document.model';

export interface Meeting {
  id: string;
  committeeId: string;
  meetingNumber: string;
  title?: string;
  location: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  isCompleted: boolean;
  isApproved: boolean;
  description?: string;
  currentAgendaItemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingDetail extends Meeting {
  committee: any;
  agendaItems: AgendaItemDetail[];
  participants: MeetingParticipant[];
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  committeeMemberId: string;
  committeeMemberName?: string;
  committeeMemberTitle?: string;
  committeeMemberRole?: string;
  isParticipating: boolean;
  isPresent: boolean;
  substituteForId?: string;
  substituteForName?: string;
  createdAt: string;
  committeeMember?: any;
}

export interface AddParticipantRequest {
  committeeMemberId: string;
  isParticipating: boolean;
  substituteForId?: string;
}

export interface UpdateAttendanceRequest {
  isPresent: boolean;
}

export interface CreateMeetingRequest {
  committeeId: string;
  title?: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  isOpen?: boolean;
}

export interface UpdateMeetingRequest {
  title?: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface UpdateMeetingStatusRequest {
  status: MeetingStatus;
}

export type MeetingStatus = 'open' | 'completed' | 'approved';

export interface AgendaItem {
  id: string;
  meetingId: string;
  number: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgendaItemDetail extends AgendaItem {
  recommendations: Recommendation[];
  documents: DocumentModel[];
  conclusions: Conclusion[];
  notes: Note[];
  tasks: Task[];
}

export interface Recommendation {
  id: string;
  agendaItemId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conclusion {
  id: string;
  agendaItemId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  agendaItemId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  agendaItemId: string;
  description: string;
  assignedUserId: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgendaItemRequest {
  title: string;
  description?: string;
}

export interface UpdateAgendaItemRequest {
  title: string;
  description?: string;
}

export interface ReorderAgendaItemsRequest {
  orderedIds: string[];
}
