import {
  FieldErrorsImpl,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form';

export type OtherInputProps = {
  labelClassName?: string; 
  inputClassName?: string;
  descriptionClassName?: string;
  inputContainerClassName?: string;
  label?: string | JSX.Element;
  description?: string | JSX.Element;
  setValue?: UseFormSetValue<any>;
  register?: UseFormRegisterReturn<any>;
  errors?: Partial<FieldErrorsImpl<object>>;
  component?: JSX.Element;
  rows?: number;
  isLoading?: boolean;
}