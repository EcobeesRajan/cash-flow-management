import React from "react";

type Props = {
  viewMode: "summary" | "income" | "expense" | "Records";
  setViewMode: (mode: "summary" | "income" | "expense" | "Records") => void;
};

const ViewToggle: React.FC<Props> = ({ viewMode, setViewMode }) => {
  const baseClass = "px-4 py-2 rounded-full font-semibold text-white transition w-full sm:w-auto";
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6 px-2 py-3">
      <button
        onClick={() => setViewMode("summary")}
        className={`${baseClass} ${viewMode === "summary" ? "bg-blue-600" : "bg-gray-400"}`}
      >
        Summary
      </button>
      <button
        onClick={() => setViewMode("income")}
        className={`${baseClass} ${viewMode === "income" ? "bg-green-600" : "bg-gray-400"}`}
      >
        Income
      </button>
      <button
        onClick={() => setViewMode("expense")}
        className={`${baseClass} ${viewMode === "expense" ? "bg-red-600" : "bg-gray-400"}`}
      >
        Expenses
      </button>
      <button
        onClick={() => setViewMode("Records")}
        className={`${baseClass} ${viewMode === "Records" ? "bg-purple-600" : "bg-gray-400"}`}
      >
        Records
      </button>
    </div>
  );
};

export default ViewToggle;










// import React from "react";

// type Props = {
//   viewMode: "summary" | "income" | "expense"| "Records" ;
//   setViewMode: (mode: "summary" | "income" | "expense" | "Records" ) => void;
// };

// const ViewToggle: React.FC<Props> = ({ viewMode, setViewMode }) => {
//    const baseClass = "px-4 py-2 rounded-full font-semibold text-white transition w-full sm:w-auto";
//   return (
//     <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
//       <button
//         onClick={() => setViewMode("summary")}
//         className={`${baseClass} ${viewMode === "summary" ? "bg-blue-600" : "bg-gray-400"}`}
//       >
//         Summary
//       </button>
//       <button
//         onClick={() => setViewMode("income")}
//         className={`${baseClass} ${viewMode === "income" ? "bg-green-600" : "bg-gray-400"}`}
//       >
//         Income
//       </button>
//       <button
//         onClick={() => setViewMode("expense")}
//         className={`${baseClass} ${viewMode === "expense" ? "bg-red-600" : "bg-gray-400"}`}
//       >
//         Expenses
//       </button>
//        <button
//         onClick={() => setViewMode("Records")}
//         className={`${baseClass} ${viewMode === "Records" ? "bg-purple-600" : "bg-gray-400"}`}
//       >
//         Records
//       </button>
//     </div>
//   );
// };

// export default ViewToggle;
