import { BacklogIssuePriorityId } from '~/constants/backlog';

export type BacklogProject = {
  id: number;
  projectKey: string;
  name: string;
  chartEnabled: boolean;
  subtaskingEnabled: boolean;
  projectLeaderCanEditProjectLeader: boolean;
  textFormattingRule: string;
  archived: boolean;
  displayOrder: number;
};

export type BacklogIssueType = {
  id: number;
  projectId: number;
  name: string;
  color: string;
  displayOrder: number;
};

export type BacklogIssuePriority = {
  id: BacklogIssuePriorityId;
  name: string;
};

export type BacklogIssueStatus = {
  id: number;
  projectId: number;
  name: string;
  color: string;
  displayOrder: number;
};

export type BacklogAssignee = {
  id: number;
  name: string;
  roleType: number;
  lang: unknown;
  mailAddress: string;
};

export type BacklogActor = {
  id: number;
  userId: string;
  name: string;
  roleType: number;
  lang: string;
  mailAddress: string;
};

export type BacklogIssue = {
  id: number;
  projectId: number;
  issueKey: string;
  keyId: number;
  issueType: BacklogIssueType;
  summary: string;
  description: string;
  resolutions: unknown;
  priority: BacklogIssuePriority;
  status: BacklogIssueStatus;
  assignee: BacklogAssignee;
  category: unknown[];
  versions: unknown[];
  milestone: unknown[];
  startDate: string;
  dueDate: string;
  estimatedHours: unknown;
  actualHours: unknown;
  parentIssueId: unknown;
  createdUser: BacklogActor;
  created: string;
  updatedUser: BacklogActor;
  updated: string;
  customFields: unknown[];
  attachments: unknown[];
  sharedFiles: unknown[];
  stars: unknown[];
};

export type BacklogComment = {
  id: number;
  content: string;
  changeLog: unknown;
  createdUser: BacklogActor;
  created: string;
  updated: string;
  starts: unknown[];
  notifications: unknown[];
};

export type BacklogNotification = {
  id: number;
  alreadyRead: boolean;
  reason: number;
  resourceAlreadyRead: boolean;
  project: BacklogProject;
  issue: BacklogIssue | null;
  comment: BacklogComment | null;
  pullRequest: unknown;
  pullRequestComment: unknown;
  sender: BacklogActor;
  created: string;
};
