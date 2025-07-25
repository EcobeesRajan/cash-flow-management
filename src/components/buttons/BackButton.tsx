'use client'

import { useRouter } from 'next/navigation';

type BackButtonProps = {
  to?: string;
  className?: string;
};

const BackButton = ({ to = "/dashboard", className = "" }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(to)}
      className={`absolute top-4 left-4 text-blue-600 font-semibold hover:underline ${className}`}
    >
      Back
    </button>
  );
};

export default BackButton;
