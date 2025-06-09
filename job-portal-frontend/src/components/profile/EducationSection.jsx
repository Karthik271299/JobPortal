import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FaTrash, FaPlus } from "react-icons/fa";

const EducationSection = () => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const addEducation = () => {
    append({
      degree: "",
      field: "",
      institution: "",
      year: "",
      cgpa: "",
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Education</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Degree</label>
            <input
              type="text"
              {...register(`education.${index}.degree`, { required: "Degree is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.education?.[index]?.degree && (
              <p className="text-red-500 text-xs mt-1">{errors.education[index].degree.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Field</label>
            <input
              type="text"
              {...register(`education.${index}.field`, { required: "Field is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.education?.[index]?.field && (
              <p className="text-red-500 text-xs mt-1">{errors.education[index].field.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Institution</label>
            <input
              type="text"
              {...register(`education.${index}.institution`, { required: "Institution is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.education?.[index]?.institution && (
              <p className="text-red-500 text-xs mt-1">{errors.education[index].institution.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              {...register(`education.${index}.year`, {
                required: "Year is required",
                min: { value: 1900, message: "Invalid year" },
                max: { value: new Date().getFullYear(), message: "Future year not allowed" },
              })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.education?.[index]?.year && (
              <p className="text-red-500 text-xs mt-1">{errors.education[index].year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CGPA</label>
            <input
              type="text"
              {...register(`education.${index}.cgpa`, { required: "CGPA is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.education?.[index]?.cgpa && (
              <p className="text-red-500 text-xs mt-1">{errors.education[index].cgpa.message}</p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove education entry"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="flex items-center gap-2 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition"
      >
        <FaPlus /> Add Education
      </button>
    </div>
  );
};

export default EducationSection;
