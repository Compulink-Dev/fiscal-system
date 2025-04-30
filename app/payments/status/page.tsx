import React from "react";

function Status() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p>Verifying your payment...</p>
      </div>
    </div>
  );
}

export default Status;
