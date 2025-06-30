import React from "react";

type Props = {
    viewType: "income" | "expense";
    setViewType: (type: "income" | "expense") => void;
};

const ToggleButtons: React.FC<Props> = ({ viewType, setViewType }) => (
    <div className="flex justify-center mb-6 space-x-4">
        <button
            className={`px-6 py-2 rounded-full text-white font-medium ${viewType === "income" ? "bg-green-600" : "bg-gray-400"
                }`}
            onClick={() => setViewType("income")}
        >
            Income
        </button>
        <button
            className={`px-6 py-2 rounded-full text-white font-medium ${viewType === "expense" ? "bg-red-600" : "bg-gray-400"
                }`}
            onClick={() => setViewType("expense")}
        >
            Expenses
        </button>
    </div>
);

export default ToggleButtons;

