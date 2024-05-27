import { SelectHTMLAttributes } from "react";
import { getErrorValue } from "../../lib/functions";
import { OtherInputProps } from "../../model/components/other-input-props";
import FormErrorMessage from "./FormErrorMessage";

export type InputCheckboxProps = SelectHTMLAttributes<HTMLInputElement> &
  OtherInputProps & {
    checkboxOptions: {
      id: string;
      label: string;
      register: any;
      name: string;
    }[];
  };

const InputCheckbox = (props: InputCheckboxProps) => {
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
    checkboxOptions,
    ...rest
  } = props;

  return ( checkboxOptions.length > 0 ?
    <div className="w-full">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}
      {/* <select
        name={name}
        {...register}
        {...(id && { id: id })}
        className="select select-bordered w-full"
        {...rest}
        onChange={(e) => {
          if (onChange) onChange(e);
          if (!setValue) return;
          setValue(name!, e.target.value);
        }}
      >
        {
          model.map((m: GeneralData, index: number) => <option key={index} value={m.id}>{m.name}</option>)
        }
      </select> */}
      <div className="grid grid-cols-2">
        { checkboxOptions.map((checkboxOption, index) => (
          <div key={index} className="form-control">
            <label className="label cursor-pointer justify-start gap-4 items-center">
              <input
                {...(checkboxOption as any).register}
                id={checkboxOption.id + "-checkbox"}
                name={checkboxOption.name}
                type="checkbox"
                value={checkboxOption.id}
                className="checkbox checkbox-primary bg-base-200"
                {...rest}
              />
              <span className="label-text">{checkboxOption.label}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="label">
        {description && <span className="label-text">{description}</span>}
        {errors &&
          (getErrorValue(name ?? "", errors) ||
            (errors as any)[name ?? ""]) && (
            <FormErrorMessage name={name ?? ""} errors={errors as any} />
          )}
      </div>
    </div> : <></>
  );
};

export default InputCheckbox;
