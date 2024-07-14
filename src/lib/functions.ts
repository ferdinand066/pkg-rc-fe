import currency from "currency.js";
import { capitalize, startCase } from "lodash";
import moment from "moment";
import { UseFormSetValue } from "react-hook-form";

const classJoin = (...str: string[]) => {
  return str.join(' ');
}

const handleToastError = (str: string = "") => {
  return {
    render({ data }: any) {
      return capitalize((<Error>data)?.message ?? str);
    },
  };
};

const handleToastErrorList = (str: string = "") => {
  return {
    render({ data }: any) {
      let message = JSON.parse((<Error>data)?.message)
      return capitalize(message.message ?? str);
    },
  };
}

const getJSONParseableSubstring = (str: string)=>{
  const startIndex = str.indexOf('{');
  const endIndex = str.lastIndexOf('}');

  const jsonSubstring = str.substring(startIndex, endIndex + 1);
  return jsonSubstring;
}

const handleToastSuccess = (str: string = "") => {
  return {
    render({ data }: any) {
      return data?.message ?? str;
    },
  };
};

const getErrorValue = (name: string, errors: any) => {
  if (!errors) return;
  const splittedName = name.split(".");
  let currentError = errors;

  for (let e in splittedName) {
    if (currentError[splittedName[e]] === undefined) return false;
    currentError = currentError[splittedName[e]];
  }
  return true;
};


const enableOnlyNumbers = (
  e: React.ChangeEvent<HTMLInputElement>,
  name: string,
  setValue: UseFormSetValue<any>
) => {
  const inputValue = e.target.value.replace(/[^0-9]/g, "");
  setValue(name as any, inputValue);
};

const extractTypeFromModel = (type: string) => {
  const text = type.split('\\');
  return startCase(text[text.length - 1]);
}


const formatDateRange = (startDate: Date, endDate: Date) => {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  if (
    startMoment.isSame(endMoment, "month") &&
    startMoment.isSame(endMoment, "year")
  ) {
    return `${startMoment.format("D")} - ${endMoment.format("D MMMM YYYY")}`;
  } else if (startMoment.isSame(endMoment, "year")) {
    return `${startMoment.format("D MMMM")} - ${endMoment.format(
      "D MMMM YYYY"
    )}`;
  } else {
    return `${startMoment.format("D MMMM YYYY")} - ${endMoment.format(
      "D MMMM YYYY"
    )}`;
  }
};

const numberToStringCurrency = (num: number) => {
  try {
    const res = currency(Math.abs(num), {
    separator: ".",
    decimal: ',',
    precision: 0,
    symbol: "",
  }).format();
  return res
  } catch {
    return num;
  }
}

const stringCurrencyToNumber = (str: string | undefined) => {
  if (!str) return "0";
  return (str).split(".").join("").replace(",", '.');
}

function getInitials(fullName: string): string {
  if (!fullName) return "";

  const nameParts = fullName.trim().split(/\s+/); // Split the name by spaces
  if (nameParts.length === 0) return '';

  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : "";

  return `${firstInitial}${lastInitial}`;
}

export { getInitials, classJoin, enableOnlyNumbers, extractTypeFromModel, formatDateRange, getErrorValue, getJSONParseableSubstring, handleToastError, handleToastErrorList, handleToastSuccess, numberToStringCurrency, stringCurrencyToNumber };

