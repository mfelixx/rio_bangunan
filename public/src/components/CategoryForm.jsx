/* eslint-disable react/prop-types */
const CategoryForm = ({
  // eslint-disable-next-line react/prop-types
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Enter category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer font-semibold py-2 px-4 my-[1rem] focus:ring-2"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 my-[1rem] text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
