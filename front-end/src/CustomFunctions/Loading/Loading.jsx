export const Loading = ({ message }) => {
  return (
    <section className="flex flex-col items-center justify-center">
      {message && (
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{message}</h1>
      )}
      <div className="w-20 h-20 border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
    </section>
  );
};
