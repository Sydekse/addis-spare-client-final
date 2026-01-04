export interface CreateRatingDto {
  score: number;       // 1 to 5
  productId: string;   // UUID
}

export interface UpdateRatingDto {
  score: number;       // 1 to 5
}

export interface Rating {
  id: string;
  userId: string;
  productId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
