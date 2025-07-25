'use client';

import BackButton from "@/components/buttons/BackButton";
import useIncomeForm from "@/app/hooks/income/useIncomeMenuForm";
import IncomeForm from "@/components/income/IncomeForm";

export default function IncomePage() {
  const formProps = useIncomeForm();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 relative">
      <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <BackButton to="/dashboard" className="!static" />
          <h2 className="text-xl sm:text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Record Income
          </h2>
          <div style={{ width: "64px" }} />
        </div>

        <IncomeForm {...formProps} />
      </div>
    </div>
  );
}
