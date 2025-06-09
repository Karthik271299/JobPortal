import { useState, useCallback } from "react";
import axiosInstance from "../services/api";

/**
 * Custom hook for making API calls with loading and error handling.
 * @param {object} config - Axios request config (url, method, data, params, headers)
 * @param {boolean} immediate - Whether to call API immediately on hook mount
 * @returns {object} { data, error, loading, execute }
 */
const useApi = (config = {}, immediate = false) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to execute the API call
  const execute = useCallback(
    async (overrideConfig = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance({
          ...config,
          ...overrideConfig,
        });
        setData(response.data);
        setLoading(false);
        return response.data;
      } catch (err) {
        setError(err.response?.data || err.message || "Unexpected error");
        setLoading(false);
        throw err;
      }
    },
    [config]
  );

  // Optionally call API immediately on mount
  // useEffect(() => {
  //   if (immediate) {
  //     execute();
  //   }
  // }, [execute, immediate]);

  return { data, error, loading, execute };
};

export default useApi;
