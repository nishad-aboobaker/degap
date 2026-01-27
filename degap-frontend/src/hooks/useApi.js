import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../services/api";

export function useApiQuery(key, url, options = {}) {
  const { params, enabled = true, select } = options;

  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const response = await api.get(url, { params });
      return response.data;
    },
    enabled,
    select,
  });
}

export function useApiMutation(method, url, options = {}) {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (data) => {
      const config = {
        method,
        url,
        data,
      };

      const response = await api(config);
      return response.data;
    },
    onSuccess,
    onError,
  });
}

