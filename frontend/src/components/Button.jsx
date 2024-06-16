export const Button = ({ data, onClick, isSelected }) => {
  console.log(data + " " + isSelected);
  return (
    <button
      type="button"
      className={`${
        isSelected
          ? "bg-blue-700 hover:bg-blue-800 text-white"
          : "bg-white text-black scale-110 border border-black"
      } focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5`}
      onClick={onClick}
    >
      {data}
    </button>
  );
};

// focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-transform duration-200
