export interface NewsletterMailSettings {
  enabled: boolean;
  configured: boolean;
  ready: boolean;
  workerEnabled: boolean;
  from: string;
  worker: { pausedUntil: string | null };
}

export interface NewsletterAudience {
  registered: number;
  eligible: number;
  excluded: number;
}

export type NewsletterSendMode = "ALL" | "SELECTED";
export interface NewsletterSendRequest {
  mode: NewsletterSendMode;
  subscriberIds?: string[];
}
export interface NewsletterSubscriberOption {
  id: string;
  name: string | null;
  email: string;
}

export type NewsletterRecipientStatus =
  | "PENDING"
  | "SENDING"
  | "SENT"
  | "FAILED"
  | "SKIPPED"
  | "UNKNOWN";
export interface NewsletterMailCampaign {
  status:
    | "NOT_QUEUED"
    | "PROCESSING"
    | "NEEDS_REVIEW"
    | "COMPLETED"
    | "CANCELLED";
  campaign: null | {
    id: string;
    subject: string;
    createdAt: string;
    completedAt: string | null;
    cancelledAt: string | null;
  };
  counts?: {
    pending: number;
    sending: number;
    sent: number;
    failed: number;
    skipped: number;
    unknown: number;
  };
  total?: number;
}

export interface NewsletterRecipient {
  id: string;
  email: string;
  status: NewsletterRecipientStatus;
  attempts: number;
  sentAt: string | null;
  errorCode: string | null;
}

export interface NewsletterDeliveryRecord {
  id: string;
  subscriberId: string;
  sentAt: string;
  subscriber: { name: string | null; email: string };
}
