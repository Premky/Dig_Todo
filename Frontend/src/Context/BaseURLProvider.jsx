import { createContext, useContext, useEffect, useState } from 'react';
import { getBaseUrl } from '../Utilities/getBaseUrl';

const BaseURLContext = createContext(null);

export const BaseURLProvider = ({ children }) => {
  const [baseURL, setBaseURL] = useState(null);

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = await getAvailableBaseUrl();
      setBaseURL(url);
    };
    fetchBaseUrl();
  }, []);

  if (!baseURL) return <div>🔁 Connecting to API...</div>;

  return (
    <BaseURLContext.Provider value={baseURL}>
      {children}
    </BaseURLContext.Provider>
  );
};

export const useBaseURL = () => useContext(BaseURLContext);
