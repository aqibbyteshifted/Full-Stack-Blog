import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems: initialTotalItems = 0,
}: UsePaginationProps = {}): [PaginationState, PaginationActions] {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    pageSize: initialPageSize,
    totalItems: initialTotalItems,
    totalPages: Math.ceil(initialTotalItems / initialPageSize) || 1,
  });

  const goToPage = useCallback((page: number) => {
    setState((prev) => {
      const newPage = Math.max(1, Math.min(page, prev.totalPages || 1));
      return {
        ...prev,
        page: newPage,
      };
    });
  }, []);

  const nextPage = useCallback(() => {
    setState((prev) => {
      const newPage = Math.min(prev.page + 1, prev.totalPages || 1);
      return {
        ...prev,
        page: newPage,
      };
    });
  }, []);

  const prevPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: Math.max(1, prev.page - 1),
    }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    const newPageSize = Math.max(1, size);
    setState((prev) => {
      const totalPages = Math.ceil(prev.totalItems / newPageSize) || 1;
      const newPage = Math.min(prev.page, totalPages);
      
      return {
        ...prev,
        page: newPage,
        pageSize: newPageSize,
        totalPages,
      };
    });
  }, []);

  const setTotalItems = useCallback((total: number) => {
    const newTotalItems = Math.max(0, total);
    setState((prev) => {
      const totalPages = Math.ceil(newTotalItems / prev.pageSize) || 1;
      const newPage = Math.min(prev.page, totalPages);
      
      return {
        ...prev,
        page: newPage,
        totalItems: newTotalItems,
        totalPages,
      };
    });
  }, []);

  return [
    state,
    {
      goToPage,
      nextPage,
      prevPage,
      setPageSize,
      setTotalItems,
    },
  ];
}

export default usePagination;
