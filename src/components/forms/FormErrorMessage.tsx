import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { ErrorMessage } from '@hookform/error-message';
import { FieldErrorsImpl } from 'react-hook-form';

export type FormErrorMessageData = {
  name: string;
  errors: Partial<FieldErrorsImpl<object>>;
};

const FormErrorMessage = ({
  name,
  errors,
}: FormErrorMessageData) => {
  return (
    <div className="flex flex-row gap-0.5 mt-1 text-sm text-red-500 items-center">
      <ExclamationCircleIcon className="w-4 h-4" />
      <ErrorMessage
        errors={errors}
        name={name}
        as={<div className="mt-1 text-sm"></div>}
      />
    </div>
  );
}

export default FormErrorMessage;