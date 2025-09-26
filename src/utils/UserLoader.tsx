
const Loader = () => {
  return (
    <div className="flex flex-row gap-4 p-4 border border-[#333] rounded-lg bg-black15 shadow-sm w-full">
      <div className="animate-pulse bg-gray-700 w-12 h-12 rounded-full" />
      <div className="flex flex-col gap-3 flex-1">
        <div className="animate-pulse bg-gray-700 w-28 h-5 rounded-full" />
        <div className="animate-pulse bg-gray-700 w-36 h-5 rounded-full" />
      </div>
    </div>
  );
};

export default Loader;
