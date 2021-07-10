import React from "react"

type Props = {
  htmlFor?: string;
  label: string;
}

export const FormField: React.FC<Props> = ({ label, htmlFor, children}) => {
  return (
    <div className="flex items-center">
      <label className="w-[120px] text-gray-700" htmlFor={htmlFor}>{label}</label>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}