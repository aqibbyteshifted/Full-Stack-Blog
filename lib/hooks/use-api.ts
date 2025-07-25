import { useState, useCallback } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

type ApiRequestOptions<T = unknown> = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: T;
  skip?: boolean;
};

export function useApi<T = unknown>(endpoint: string) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchData = useCallback(
    async (options: ApiRequestOptions = {}) => {
      const { method = 'GET', headers = {}, body, skip = false } = options;

      if (skip) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `API request failed with status ${response.status}`
          );
        }

        const data = await response.json().catch(() => ({}));

        setState({
          data,
          error: null,
          loading: false,
        });

        return data as T;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';

        setState({
          data: null,
          error: errorMessage,
          loading: false,
        });

        throw error;
      }
    },
    [endpoint]
  );

  const get = useCallback(
    (options?: Omit<ApiRequestOptions, 'method'>) =>
      fetchData({ ...options, method: 'GET' }),
    [fetchData]
  );

  const post = useCallback(
    <B = unknown>(body: B, options?: Omit<ApiRequestOptions<B>, 'method' | 'body'>) =>
      fetchData({ ...options, method: 'POST', body }),
    [fetchData]
  );

  const put = useCallback(
    <B = unknown>(body: B, options?: Omit<ApiRequestOptions<B>, 'method' | 'body'>) =>
      fetchData({ ...options, method: 'PUT', body }),
    [fetchData]
  );

  const patch = useCallback(
    <B = unknown>(body: B, options?: Omit<ApiRequestOptions<B>, 'method' | 'body'>) =>
      fetchData({ ...options, method: 'PATCH', body }),
    [fetchData]
  );

  const remove = useCallback(
    (options?: Omit<ApiRequestOptions, 'method'>) =>
      fetchData({ ...options, method: 'DELETE' }),
    [fetchData]
  );

  return {
    ...state,
    fetch: fetchData,
    get,
    post,
    put,
    patch,
    delete: remove,
  };
}

export default useApi;
