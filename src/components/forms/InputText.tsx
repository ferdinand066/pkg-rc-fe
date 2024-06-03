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
    ...rest
  } = props;

  return (
    <label className="form-control w-full">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
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
          setValue(name!, e.target.value);
        }}
      />
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
