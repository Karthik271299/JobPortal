import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import classNames from "classnames";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_FILE_SIZE = 10 * 1024; // 10KB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const ImageUpload = ({ name, label }) => {
  const { control, setValue } = useFormContext();
  const [preview, setPreview] = useState(null);

  const onDrop = (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(rejection => {
        rejection.errors.forEach(error => {
          toast.error(error.message);
        });
      });
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE || file.size < MIN_FILE_SIZE) {
      toast.error("File size must be between 10KB and 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setValue(name, file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop,
  });

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field, fieldState: { error } }) => (
          <>
            <div
              {...getRootProps()}
              className={classNames(
                "border border-dashed p-4 rounded-md text-center cursor-pointer transition",
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              )}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400">(Only JPG/PNG, 10KB–2MB)</p>
            </div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded-md w-32 h-32 object-cover border"
              />
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

ImageUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default ImageUpload;
    