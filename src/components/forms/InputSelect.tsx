import { SelectHTMLAttributes } from "react";
import { getErrorValue } from "../../lib/functions";
import { GeneralData } from "../../model/components/general-data";
import { OtherInputProps } from "../../model/components/other-input-props";
import FormErrorMessage from "./FormErrorMessage";

export type InputSelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  OtherInputProps & {
    model: GeneralData[];
  };

const InputSelect = (props: InputSelectProps) => {
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
    model,
    ...rest
  } = props;

  return (
    <label className="form-control w-full">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      <select
        name={name}
        {...register}
        {...(id && { id: id })}
        className="select select-bordered w-full shadow"
        {...rest}
        onChange={(e) => {
          if (onChange) onChange(e);
          if (!setValue) return;
          setValue(name!, e.target.value);
        }}
      >
        {model.map((m: GeneralData, index: number) => (
          <option key={index} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
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

export default InputSelect;
