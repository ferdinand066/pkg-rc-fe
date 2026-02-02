import { ClockIcon } from "@heroicons/react/outline";

const LoadingFallback = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-200/50">
      <ClockIcon className="w-10 h-10 text-gray-500 animate-spin" />
    </div>
  );
};

export default LoadingFallback;
