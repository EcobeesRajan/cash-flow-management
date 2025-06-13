import BackButton from "../components/buttons/BackButton";
import useIncomeForm from "../components/income/UseIncomeForm";
import IncomeForm from "../components/income/IncomeForm";

const Income = () => {
  const formProps = useIncomeForm();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <BackButton to="/dashboard" className="!static" />
          <h2 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Record Income
          </h2>
          <div style={{ width: "64px" }} />
        </div>
        <IncomeForm {...formProps} />
      </div>
    </div>
  );
};

export default Income;
