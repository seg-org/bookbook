import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="mt-4 text-xl text-gray-600">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" passHref>
        <button className="mt-6 rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">Go back to Home</button>
      </Link>
    </div>
  );
};

export default NotFound;
