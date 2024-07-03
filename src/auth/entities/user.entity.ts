export class User {
  uniqueId: string;
  name: string;
  email: string;
  registeredAt: Date;
  role?: string;
  articles?: string[];
  articlesLiked?: string[];
}
