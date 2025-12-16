const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="relative flex justify-center items-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 animate-ping absolute"></div>
        <div className="w-10 h-10 rounded-full border-4 border-blue-600 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
