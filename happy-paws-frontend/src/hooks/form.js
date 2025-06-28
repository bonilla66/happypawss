import { useState } from "react";
import { toast } from "react-toastify";

export function UseForm(initialValues, validate, { showErrorToast = false } = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e, onSubmit) => {
    e.preventDefault();
    const error = validate(values);
    if (error) {
      if (showErrorToast) toast.error(error);
      return;
    }
    onSubmit();
  };

  return { values, handleChange, handleSubmit };
}
