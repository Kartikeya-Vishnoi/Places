import { useRef, useState, useEffect, useCallback } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();
 
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          console.log(responseData);
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        if(err.message !== 'The user aborted a request.'){
          setError(err.message)
          setIsLoading(false)
          throw err
      }
      }
    },
    []
  );
  const clearError = () => {
    setError(null);
  };
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

// Jab koi component unmount hoga toh useEffect ka cleaner function chalega jab woh component unmount hone ke baad ya fir useEffect fir se chalega uske pehle cleaner function http requests ki array mein har ek requests ko clear kar dega

//httprequests ko store kar ne ke liye hm log useRef ka use kar rhe hain taki woh array as a reference store ho sake aur usko dobara re-initialize na kiya jaye
