import { InputHTMLAttributes } from "react";
import { classJoin, getErrorValue } from "../../lib/functions";
import { OtherInputProps } from "../../model/components/other-input-props";
import FormErrorMessage from "./FormErrorMessage";

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
