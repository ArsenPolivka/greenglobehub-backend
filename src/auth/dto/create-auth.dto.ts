export class CreateAuthDto {
  readonly uniqueId: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly articles: Array<string>;
  readonly articlesLiked: Array<string>;
}
