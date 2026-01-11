import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, notificationApi } from "@/utils/api";

export const useNotifications = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications"),
    select: (res) => res.data.notifications,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) =>
      api.delete(`/notifications/${notificationId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: () =>
      notificationApi.getSettings(api).then((res) => res.data.settings),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: any) =>
      notificationApi.updateSettings(api, newSettings),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] }),
    onError: (error: any) => {
      console.error("Error updating settings", error);
    },
  });

  const updateSettings = (newSettings: any) => {
    updateSettingsMutation.mutate(newSettings);
  };

  return {
    notifications: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,

    notificationSettings: settingsData,
    isLoadingSettings,
    settingsError: updateSettingsMutation.error,
    refetchSettings,
    updateSettings,
    isUpdatingSettings: updateSettingsMutation.isPending,
  };
};
