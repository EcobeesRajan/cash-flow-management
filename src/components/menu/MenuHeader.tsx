'use client'

import React from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/buttons/BackButton";

const MenuHeader: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6 px-4 sm:px-6">
      <BackButton to="/dashboard" className="!static" />
      
      {/* Centered Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-center flex-grow">
        Menu
      </h2>

      {/* Add New Menu Button */}
      <button
        onClick={() => router.push("/add-menu")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base mt-2 sm:mt-0"
      >
        Add New Menu
      </button>
    </div>
  );
};

export default MenuHeader;
