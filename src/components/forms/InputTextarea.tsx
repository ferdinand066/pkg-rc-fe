import { InputHTMLAttributes } from "react";
import { getErrorValue } from "../../lib/functions";
import { OtherInputProps } from "../../model/components/other-input-props";
import FormErrorMessage from "./FormErrorMessage";

export type InputTextareaProps = InputHTMLAttributes<HTMLTextAreaElement> &
  OtherInputProps;

const InputTextarea = (props: InputTextareaProps) => {
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
      <textarea
        name={name}
        {...register}
        {...(id && { id: id })}
        className="textarea textarea-bordered h-36 w-full shadow"
        {...rest}
      ></textarea>
      <div className="label">
        {description && <span className="label-text">{description}</span>}
        {errors &&
          (getErrorValue(name ?? "", errors) ||
            (errors as any)[name ?? ""]) && (
            <FormErrorMessage name={name ?? ""} errors={errors as any} />
          )}
      </div>
    </label>
  );
};

export default InputTextarea;
