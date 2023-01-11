import { atom, useAtom } from "jotai";

const LoadingState = atom(false);

export const useLoading = () => {
  const [isLoading, setLoading] = useAtom(LoadingState);
  return { isLoading, setLoading };
};

export const LoadingIndicator = () => {
  const { isLoading } = useLoading();

  const animClass = isLoading ? "right-0" : "right-[-70px]";

  return (
    <div className={`fixed bottom-0 mb-4 p-4 transition-all ${animClass}`}>
      <div className="bg-white rounded-full p-2">
        <div className="bg-gray-300 rounded-full h-4 w-4 animate-pulse" />
      </div>
    </div>
  );
};
