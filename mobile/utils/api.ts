import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";

const API_PORT = "5001";

type ExpoConstantsWithLegacyManifest = typeof Constants & {
  manifest?: {
    debuggerHost?: string;
  };
  manifest2?: {
    extra?: {
      expoClient?: {
        hostUri?: string;
      };
    };
  };
};

const normalizeApiBaseUrl = (value: string) => {
  const trimmedValue = value.trim().replace(/\/$/, "");
  return trimmedValue.endsWith("/api") ? trimmedValue : `${trimmedValue}/api`;
};

const getExpoHost = () => {
  const constantsWithLegacyManifest =
    Constants as ExpoConstantsWithLegacyManifest;
  const hostUri =
    Constants.expoConfig?.hostUri ??
    constantsWithLegacyManifest.manifest2?.extra?.expoClient?.hostUri ??
    constantsWithLegacyManifest.manifest?.debuggerHost;

  if (!hostUri) {
    return null;
  }

  return hostUri.replace(/^https?:\/\//, "").split(":")[0] ?? null;
};

const getApiUrl = () => {
  const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (configuredApiUrl) {
    return normalizeApiBaseUrl(configuredApiUrl);
  }

  const expoHost = getExpoHost();

  if (expoHost) {
    return `http://${expoHost}:${API_PORT}/api`;
  }

  return `http://localhost:${API_PORT}/api`;
};

const API_BASE_URL = getApiUrl();

console.log("API base URL:", API_BASE_URL);

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (
  getToken: () => Promise<string | null>,
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
  searchUsers: (api: AxiosInstance, query: string) =>
    api.get(`/users/search?q=${query}`),
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
  quotePost: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/posts/${postId}/quote`, { content }),
  searchPostsByHashtag: (api: AxiosInstance, hashtag: string) =>
    api.get(`/posts/hashtag/${hashtag}`),
  getUserLikedPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}/likes`),
  bookmarkPost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/bookmark`),
  getUserBookmarks: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}/bookmarks`),
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

export const notificationApi = {
  getSettings: (api: AxiosInstance) => api.get("/notifications/settings"),
  updateSettings: (api: AxiosInstance, settings: any) =>
    api.put("/notifications/settings", settings),
};

export const conversationApi = {
  getConversations: (api: AxiosInstance) => api.get("/conversations"),
  getOrCreateConversation: (api: AxiosInstance, otherUserId: string) =>
    api.get(`/conversations/user/${otherUserId}`),
  getMessages: (
    api: AxiosInstance,
    conversationId: string,
    page = 1,
    limit = 50,
  ) =>
    api.get(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    ),
  sendMessage: (api: AxiosInstance, conversationId: string, content: string) =>
    api.post(`/conversations/${conversationId}/messages`, { content }),
  markAsRead: (api: AxiosInstance, conversationId: string) =>
    api.patch(`/conversations/${conversationId}/read`),
  deleteConversation: (api: AxiosInstance, conversationId: string) =>
    api.delete(`/conversations/${conversationId}`),
};

export const trendApi = {
  getTrends: (api: AxiosInstance) => api.get("/trends"),
  recordSearch: (api: AxiosInstance, searchTerm: string) =>
    api.post("/trends", { searchTerm }),
  searchTrends: (api: AxiosInstance, searchTerm: string) =>
    api.get(`/trends/search?q=${searchTerm}`),
};
