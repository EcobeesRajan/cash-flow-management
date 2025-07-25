'use client';

import BackButton from "@/components/buttons/BackButton";
import useAddMenu from "@/app/hooks/menu/useAddMenu";
import MenuForm from "@/components/addmenu/MenuForm";

export default function AddMenuPage() {
  const formProps = useAddMenu();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <BackButton to="/menu" className="!static" />

          <h2 className="text-xl sm:text-2xl font-bold text-center flex-grow">
            Add New Menu Item
          </h2>

          <div className="w-16 sm:w-20" />
        </div>

        <MenuForm {...formProps} />
      </div>
    </div>
  );
}
