import React from "react";
import BackButton from "../components/buttons/BackButton";
import useAddMenu from "../hooks/UseAddMenu";
import MenuForm from "../components/addmenu/MenuForm";

const AddMenu: React.FC = () => {
  const formProps = useAddMenu(); 

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <BackButton to="/menu" className="!static" />
          <h2 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Add New Menu Item
          </h2>
          <div style={{ width: "64px" }} />
        </div>

        <MenuForm {...formProps} />
      </div>
    </div>
  );
};

export default AddMenu;
