import { api } from "./api";

export interface NewsletterSubscription {
  email: string;
  name?: string;
  cellphone?: string;
}

export const newsletterSubscriptionsService = {
  subscribe(data: NewsletterSubscription) {
    return api.post<{ message: string }>("/newsletter/subscribe", data);
  },
};
