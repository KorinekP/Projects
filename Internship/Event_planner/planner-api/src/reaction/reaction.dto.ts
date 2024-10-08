export class CreateReactionDto {
    userId: number;
    eventId: number;
    isLiked: boolean | null;
}

export class UpdateReactionDto {
    userId: number;
    eventId: number;
    isLiked: boolean;
}
