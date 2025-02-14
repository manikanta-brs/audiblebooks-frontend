const ErrorPage = () => {
  return (
    <div id="webcrumbs" className="px-6">
      <div className="h-96 p-t-0 bg-violet-700 text-primary-50 shadow-lg rounded-lg flex flex-col items-center justify-center">
        {" "}
        <h1 className="text-9xl font-title">404</h1>
        <p className="text-xl mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-sm mt-2">
          It might have been removed, renamed, or did not exist in the first
          place.
        </p>
        <a
          href="/"
          className="mt-6 bg-violet-500 text-violet-50 py-2 px-4 rounded-md shadow hover:bg-violet-600 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};
export default ErrorPage;
