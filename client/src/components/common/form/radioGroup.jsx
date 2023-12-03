import $ from 'jquery';

import CWATpPlanTier1 from '../../assets/Register/Payment-Plan-Tier-1.png';
import CWATpPlanTier2 from '../../assets/Register/Payment-Plan-Tier-2.png';
import CWATpPlanTier3 from '../../assets/Register/Payment-Plan-Tier-3.png';

const RadioGroupOptions = ({ name, label, error, options, value, checked, ...rest }) => {
  const isChecked = (value) => value.name === options[checked - 1].name;

  const pPlans = [
    { _id: 1, name: 'tierOne', file: CWATpPlanTier1 },
    { _id: 2, name: 'tierTwo', file: CWATpPlanTier2 },
    { _id: 3, name: 'tierThree', file: CWATpPlanTier3 },
  ];

  return (
    <div className="mx-auto w-full max-w-md mt-10 xl:mt-20 mb-48 md:mb-52 lg:mb-56">
      <label className="text-center">
        <div className="mb-2 xl:mb-6 md:text-xl">
          <h2>{label.title || label}</h2>
          <span>{label.subTitle || ''}</span>
        </div>
      </label>
      {options.map((option) => (
        <div key={option._id || option.id} className={`flex-column px-4 space-y-2`}>
          <input
            {...rest}
            id={option.name}
            type="radio"
            name={name}
            value={option.label}
            disabled={option.disabled}
            defaultChecked={isChecked(option)}
            className="w-0 fixed opacity-0 cwat-ticket-option"
          />
          <label
            htmlFor={option.name}
            className={`relative inline-block cursor-pointer rounded-lg pl-5 pr-2 py-4 shadow-md focus:outline-none bg-white text-sm md:text-lg font-medium text-gray-900 w-full
              ${option.disabled ? 'bg-zinc-400 text-gray-300' : ''}
             
              `}
          >
            <div className="flex w-full justify-between">
              <div className="mb-2">
                <h2 className="md:text-xl">{option.label}</h2>
                <span>
                  {option.roomType} Room {option.bedType ? `(${option.bedType})` : ''}
                </span>
              </div>
              <span className="mr-12 md:text-2xl">${option.price}</span>
            </div>
            <p>
              {' '}
              <span>{option.description}</span>
            </p>
            {$(`#${option.name}`).is(':checked') && (
              <div className="shrink-0 text-white ml-4 absolute right-4 top-1/3">
                <CheckIcon className="h-6 w-6" />
              </div>
            )}
          </label>
          {$(`#${option.name}`).is(':checked') && (
            <aside className="absolute bottom-4 inset-x-0 mx-auto w-52 md:w-60 lg:w-64 border-gray-500 border-2 p-1 rounded-md">
              <img src={pPlans[option.tier - 1].file} alt="cwat-pPlan" className="w-full" />
            </aside>
          )}
        </div>
      ))}
    </div>
  );
};

export default RadioGroupOptions;

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
