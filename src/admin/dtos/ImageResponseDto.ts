export interface ImageResponseDto {
  id: string;

  imageUrl: string;

  description: string | null;

  boardId: string | null;

  juryId: string | null;

  meetingId: string | null;

  presentedWorkId: string | null;

  createdAt: string;
}
