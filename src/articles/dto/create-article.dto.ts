export class CreateArticleDto {
  readonly authorId: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly likesCount: number;
  readonly token: string;
}
