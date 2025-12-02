import React, { useCallback } from "react";

export const Select: React.FC<{
  value: string;
  onChange: ((value: string) => void) | React.Dispatch<React.SetStateAction<string>>;
  options: { label: string; value: string }[];
  disabled?: boolean;
}> = ({ value, onChange, options, disabled }) => {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      onChange(e.currentTarget.value);
    },
    [onChange],
  );

  return (
    <select
      className="leading-[1.7] block w-full rounded-geist bg-background p-geist-half text-foreground text-sm border border-unfocused-border-color transition-colors duration-150 ease-in-out focus:border-focused-border-color outline-none cursor-pointer"
      disabled={disabled}
      value={value}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
