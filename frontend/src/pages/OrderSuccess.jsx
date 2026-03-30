const OrderSuccess = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-green-100 p-6 rounded-full mb-4 text-green-600">
        <svg
          size={64}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-16 h-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Order Successful!
      </h1>
      <p className="text-gray-600 text-lg">
        Thank you for ordering from Yesekela Café. Your coffee is being
        prepared!
      </p>
      <a href="/" className="mt-6 text-amber-600 font-bold hover:underline">
        Back to Home
      </a>
    </div>
  );
};
export default OrderSuccess;