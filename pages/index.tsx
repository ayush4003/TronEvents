import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Home: NextPage = () => {
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);

  // Function to handle the "Join Us" button click
  const handleJoinUsClick = () => {
    // Assuming successful connection, set isConnected to true
    setIsConnected(true);

    // After successful connection, navigate to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="flex-1 flex flex-col justify-center items-start px-8">
        <div className="max-w-md">
          {/* Larger BeraEvents title */}
          <h1 className="text-6xl mb-4 font-bold">TronEvents</h1>

          {/* Gap between title and description */}
          <div className="mb-6"></div>

          <p className="mb-6 text-lg text-gray-400">
            Discover and organize events related to BitTorrent and Tron blockchain.
            TronEvents is your gateway to the exciting world of decentralized
            technology. Join us in shaping the future!
          </p>

          {/* Render "Join Us" button */}
          {!isConnected && (
            <button
              className="text-white px-4 py-2 rounded-lg cursor-pointer bg-purple-500"
              onClick={handleJoinUsClick}
            >
              Join Us
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <img
          alt="Bera Moon"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          src="/tron-logo.png"
          className="object-cover max-w-full max-h-full"
          style={{ maxHeight: "80vh", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
};

export default Home;
