import { SWRConfig } from 'swr';
import axios from 'axios';

const SwrProvider: React.FC<{ children: any }> = ({ children }) => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;
