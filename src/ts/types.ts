export interface CommentData {
  author_id: string;
  author: string;
  content: string;
  avatar: string;
  created: number;
}

export interface PostData {
  author_id: string;
  author: string;
  title: string;
  subject: string;
  image: string;
  avatar: string;
  created: number;
}

export interface PostWithComments extends PostData {
  comments: CommentData[];
}

export interface ApiResponse<T> {
  data: T;
}
