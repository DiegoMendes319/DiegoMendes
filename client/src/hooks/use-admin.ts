import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useAdmin() {
  const { user } = useAuth();

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/stats');
        return response.ok;
      } catch {
        return false;
      }
    },
    enabled: !!user,
  });

  return {
    isAdmin: isAdmin || false,
    isAdminLoading,
  };
}