import { classJoin } from "../../lib/functions";

const LoadingSkeleton = ({ className }: { className: string }) => {
  return <div className={ classJoin('bg-base-200 rounded-md animate-pulse', className) }></div>;
};

export default LoadingSkeleton;
