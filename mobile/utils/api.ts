import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

// Physical Device with USB (adb reverse): Use localhost
// Android Emulator: Use 10.0.2.2
// iOS Simulator: Use localhost
// When using adb reverse, localhost works on physical device via USB tunnel
//const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://x-clone-react-native-ashy.vercel.app/api";

// Auto-detect based on platform - adjust for your setup
const getApiUrl = () => {
  // If you're using Android Emulator, uncomment this:
  // if (Platform.OS === "android") return "http://10.0.2.2:5001/api";

  // For iOS Simulator or physical device with adb reverse:
  return "http://localhost:5001/api";
};

const API_BASE_URL = getApiUrl();

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/users/profile", data),
  getUserById: (api: AxiosInstance, id: string) => api.get(`/users/${id}`),
};

export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}`),
  getUserReposts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}/reposts`),
  likePost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) =>
    api.delete(`/posts/${postId}`),
  repostPost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/repost`),
  getUserLikedPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}/likes`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
  createReply: (api: AxiosInstance, commentId: string, content: string) =>
    api.post(`/comments/${commentId}/reply`, { content }),
  deleteComment: (api: AxiosInstance, commentId: string) =>
    api.delete(`/comments/${commentId}`),
  toggleLikeComment: (api: AxiosInstance, commentId: string) =>
    api.post(`/comments/${commentId}/like`),
  cleanup: (api: AxiosInstance) => api.post(`/comments/cleanup`),
};

export const followApi = {
  getFollowers: (api: AxiosInstance, userId: string, page = 1, limit = 10) =>
    api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`),
  getFollowing: (api: AxiosInstance, userId: string, page = 1, limit = 10) =>
    api.get(`/users/${userId}/following?page=${page}&limit=${limit}`),
  followUser: (api: AxiosInstance, targetUserId: string) =>
    api.post(`/users/${targetUserId}/follow`),
};
