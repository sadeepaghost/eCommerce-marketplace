import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-blue-600">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-gray-500">The page you requested does not exist.</p>
      <Link to="/" className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white">Back to home</Link>
    </section>
  );
}

export default NotFound;