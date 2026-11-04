export interface NewsletterSubscriberDto {
  id: string;
  email: string;
  name: string | null;
  cellphone: string | null;
  isActive: boolean;
  allowEmail: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveNewsletterSubscriberDto {
  email: string;
  name: string | null;
  cellphone: string | null;
  isActive: boolean;
  allowEmail: boolean;
}
