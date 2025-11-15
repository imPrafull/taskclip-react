import { useEffect, useState } from 'react';
import { FetchError } from '../models/types';

export function useFetch<T>(fetchFn: () => Promise<T>, initialValue: T) {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<FetchError>();
  const [fetchedData, setFetchedData] = useState<T>(initialValue);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError({ message: (error as Error).message || "Failed to fetch data." });
      }
      setIsFetching(false);
    };

    fetchData();
  }, [fetchFn]);

  return {
    isFetching,
    fetchedData,
    setFetchedData,
    error,
  };
}