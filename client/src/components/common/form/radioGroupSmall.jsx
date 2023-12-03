const RadioGroupOptionsSmall = ({ name, label, error, options, value, checked, ...rest }) => {
  const isChecked = (value) => value === options[checked - 1].label;

  return (
    <div className="mx-auto w-full h-fit max-w-md mt-2 mb-6">

      <label className="text-center">
        <div className="mb-4 text-lg">
          <h2>{label.title || label}</h2>
          <span>{label.subTitle || ''}</span>
        </div>
      </label>

      <div className="flex flex-wrap w-full place-content-center space-x-2">

        {options.map((option) => (
          <div key={option._id || option.id} className={``}>
            <input
              {...rest}
              id={option.name}
              name={name}
              type="radio"
              value={option.label}
              disabled={option.disabled}
              defaultChecked={isChecked(option.label)}
            />
            {option.label}

            {/* <label
              htmlFor={option.name}
              className={`relative p-2 px-3 block cursor-pointer rounded-lg shadow-md focus:outline-none bg-white text-md font-medium text-gray-900   
              `}
            >
            </label> */}
          </div>
        ))}

      </div>
    </div>
  );
};

/* 
className="w-0 fixed opacity-0"
*/

export default RadioGroupOptionsSmall;
