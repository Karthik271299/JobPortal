import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FaTrash, FaPlus } from "react-icons/fa";
import classNames from "classnames";

const proficiencyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

const SkillsSection = () => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const addSkill = () => {
    append({ name: "", level: "", years: "" });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Skills</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Skill Name</label>
            <input
              type="text"
              {...register(`skills.${index}.name`, { required: "Required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.skills?.[index]?.name && (
              <p className="text-red-500 text-xs mt-1">{errors.skills[index].name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Proficiency</label>
            <select
              {...register(`skills.${index}.level`, { required: "Required" })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {proficiencyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.skills?.[index]?.level && (
              <p className="text-red-500 text-xs mt-1">{errors.skills[index].level.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Years</label>
            <input
              type="number"
              min="0"
              {...register(`skills.${index}.years`, {
                required: "Required",
                min: { value: 0, message: "Invalid number" }
              })}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {errors.skills?.[index]?.years && (
              <p className="text-red-500 text-xs mt-1">{errors.skills[index].years.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-600 hover:text-red-800 p-2 mt-5"
            aria-label="Remove skill"
          >
            <FaTrash />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSkill}
        className="flex items-center gap-2 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition"
      >
        <FaPlus /> Add Skill
      </button>
    </div>
  );
};

export default SkillsSection;
