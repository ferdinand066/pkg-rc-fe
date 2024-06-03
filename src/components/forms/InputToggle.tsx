import { SelectHTMLAttributes } from "react";
import { classJoin, getErrorValue } from "../../lib/functions";
import { OtherInputProps } from "../../model/components/other-input-props";
import FormErrorMessage from "./FormErrorMessage";

export type InputToggleProps = SelectHTMLAttributes<HTMLInputElement> &
  OtherInputProps;

const InputToggle = (props: InputToggleProps) => {
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
    <div className={classJoin("w-full", inputContainerClassName ?? "")}>
      <div className="grid grid-cols-2">
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4 items-center">
            <input
              {...register}
              {...(id && { id: id })}
              type="checkbox"
              className="toggle toggle-primary"
              {...rest}
            />
            <span className="label-text">{label}</span>
          </label>
          {description ||
            (errors && getErrorValue(name ?? "", errors) && (
              <div className="label">
                {description && (
                  <span className="label-text">{description}</span>
                )}
                {errors &&
                  (getErrorValue(name ?? "", errors) ||
                    (errors as any)[name ?? ""]) && (
                    <FormErrorMessage
                      name={name ?? ""}
                      errors={errors as any}
                    />
                  )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InputToggle;
