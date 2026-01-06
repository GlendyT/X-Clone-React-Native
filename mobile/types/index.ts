export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  createdAt?: string;
  followingCount?: number;
  followersCount?: number;
  isFollowing?: boolean;
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  user: User;
  likes: string[];
  parentComment?: string;
  replies?: Comment[];
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
  isRepost?: boolean;
  originalPost?: Post;
  repostedBy?: User[];
}

export interface Notification {
  _id: string;
  from: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: "like" | "comment" | "follow" | "repost" | "reply";
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  createdAt: string;
}
