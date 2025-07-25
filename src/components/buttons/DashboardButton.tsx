'use client'

import React from "react";
import { useRouter } from "next/navigation";


type DashboardButtonProps = {
  label: string;
  to: string;
};

const DashboardButton: React.FC<DashboardButtonProps> = ({ label, to }) => {
  const router = useRouter();

  return (
    
    <button
      onClick={() => router.push(to)}
      className="py-3 px-5 bg-blue-400 text-white rounded font-semibold hover:bg-green-700 transition"
    >
      {label}
    </button>
  );
};

export default DashboardButton;
