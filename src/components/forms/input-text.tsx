import { InputHTMLAttributes } from "react";
import { classJoin, getErrorValue } from "../../lib/functions";
import { OtherInputProps } from "../../model/components/other-input-props";
import FormErrorMessage from "./form-error-message";

export type InputTextProps = InputHTMLAttributes<HTMLInputElement> &
  OtherInputProps;

const InputText = (props: InputTextProps) => {
  const {
    labelClassName,
    inputContainerClassName,
    inputClassName,
    descriptionClassName,
    id,
    name,
    label,
    description,
    setValue,
    errors,
    register,
    onChange,
    component,
    prefix,
    isLoading,
    ...rest
  } = props;

  return (
    <label className="form-control w-full">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <div className="relative">
        <input
          name={name}
          {...register}
          {...(id && { id: id })}
          className={classJoin(
            "input input-bordered w-full shadow",
            inputClassName ?? ""
          )}
          {...rest}
          onChange={(e) => {
            if (onChange) onChange(e);
            if (!setValue) return;
            setValue(name!, e.target.value, { shouldDirty: true });
          }}
          onBlur={(e) => {
            if (!setValue) return;
            if (props.type === 'time' && props.step !== undefined){
              const inputValue = e.target.value; // Get the input value (HH:MM)
              const [hours, minutes] = inputValue.split(':').map(Number); // Split and parse hours and minutes

              // Convert step from seconds to minutes
              const stepInMinutes = Number(props.step) / 60;
              
              // Round the minutes to the nearest step interval
              let roundedMinutes = Math.round(minutes / stepInMinutes) * stepInMinutes;
              let adjustedHours = hours;
              
              // Handle overflow when minutes >= 60
              if (roundedMinutes >= 60) {
                adjustedHours = (hours + 1) % 24; // Increment hour and wrap around at 24
                roundedMinutes = 0;
              }
              
              const adjustedTime = `${String(adjustedHours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;

              // Update the value with the adjusted time
              setValue(name!, adjustedTime, { shouldDirty: true });
              return;
            }
          }}
          placeholder={ isLoading ? "" : props.placeholder}
        />
        {
          isLoading && !["date", "time"].includes(props.type ?? '') && <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
            <span className="loading loading-dots loading-xs"></span>
          </span>
        }
      </div>
      
      {description ||
        (errors && getErrorValue(name ?? "", errors) && (
          <div className="label">
            {description && <span className="label-text">{description}</span>}
            {errors &&
              (getErrorValue(name ?? "", errors) ||
                (errors as any)[name ?? ""]) && (
                <FormErrorMessage name={name ?? ""} errors={errors as any} />
              )}
          </div>
        ))}
    </label>
  );
};

export default InputText;
