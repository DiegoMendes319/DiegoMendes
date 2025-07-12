import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  description: string;
  updated_at: string;
  updated_by: string | null;
}

export function useSiteSettings() {
  const { data: settings, isLoading, error } = useQuery<SiteSetting[]>({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          credentials: 'include'
        });
        if (!response.ok) {
          // Return empty array if not authenticated or not admin
          return [];
        }
        return response.json();
      } catch (error) {
        console.log('Site settings not available:', error);
        return [];
      }
    },
    retry: 1,
    refetchInterval: 60000, // Refresh every minute
  });

  // Convert settings array to object for easier access
  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>) || {};

  // Apply dynamic styling based on settings
  useEffect(() => {
    if (settings && settings.length > 0) {
      const primaryColor = settingsMap.primary_color || '#dc2626';
      const secondaryColor = settingsMap.secondary_color || '#facc15';
      
      // Update CSS custom properties
      document.documentElement.style.setProperty('--dynamic-primary', primaryColor);
      document.documentElement.style.setProperty('--dynamic-secondary', secondaryColor);
      
      // Update meta description
      const siteName = settingsMap.site_name || 'Jikulumessu';
      const siteDescription = settingsMap.site_description || 'Portal de prestadores de serviços em Angola';
      
      document.title = `${siteName} - Portal de Prestadores de Serviços`;
      
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', siteDescription);
      }
    }
  }, [settings, settingsMap]);

  return {
    settings: settingsMap,
    isLoading,
    error,
    getSetting: (key: string, defaultValue?: string) => {
      return settingsMap[key] || defaultValue || '';
    }
  };
}