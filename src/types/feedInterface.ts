export interface IFeed {
  id?: string;
  authorId: string;
  groupId: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  id?: string;
  feedId: string;
  authorId: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILike {
  id?: string;
  feedId: string;
  userId: string;
  createdAt?: Date;
}
