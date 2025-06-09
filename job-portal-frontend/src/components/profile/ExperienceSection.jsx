import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

const ExperienceSection = () => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  const addExperience = () => {
    append({
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: ""
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              {...register(`experience.${index}.company`, { required: "Company is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.experience?.[index]?.company && (
              <p className="text-red-500 text-xs mt-1">{errors.experience[index].company.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              {...register(`experience.${index}.title`, { required: "Title is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.experience?.[index]?.title && (
              <p className="text-red-500 text-xs mt-1">{errors.experience[index].title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              {...register(`experience.${index}.startDate`, { required: "Start date is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.experience?.[index]?.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.experience[index].startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              {...register(`experience.${index}.endDate`, {
                required: "End date is required",
                validate: (value, formValues) =>
                  new Date(value) >= new Date(formValues.experience?.[index]?.startDate) ||
                  "End date must be after start date"
              })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.experience?.[index]?.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.experience[index].endDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="2"
              {...register(`experience.${index}.description`, { required: "Description is required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.experience?.[index]?.description && (
              <p className="text-red-500 text-xs mt-1">{errors.experience[index].description.message}</p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove experience"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="flex items-center gap-2 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition"
      >
        <FaPlus /> Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
