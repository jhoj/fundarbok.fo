export interface Committee {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeMember {
  id: string;
  committeeId: string;
  name: string;
  title?: string;
  role: CommitteeMemberRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CommitteeMemberRole = 'Chairman' | 'Member' | 'Secretary';

export interface CreateCommitteeRequest {
  name: string;
  description?: string;
}

export interface UpdateCommitteeRequest {
  name: string;
  description?: string;
}

export interface CreateCommitteeMemberRequest {
  name: string;
  title?: string;
  role: CommitteeMemberRole;
  isActive: boolean;
}

export interface UpdateCommitteeMemberRequest {
  name: string;
  title?: string;
  role: CommitteeMemberRole;
  isActive: boolean;
}
