import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { uploadProfileImage, updateProfile } from '../../services/profileService';
import { COUNTRY_OPTIONS, GENDER_OPTIONS } from '../../utils/constants';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  dob: yup.date().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State/Province is required'),
  country: yup.string().required('Country is required'),
  postalCode: yup.string().required('Postal code is required'),
  summary: yup.string().max(500),
  experienceYears: yup.number().min(0),
  currentSalary: yup.number().min(0),
  expectedSalary: yup.number().min(0),
});

const ProfileForm = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      skills: [{ name: '', level: '', years: '' }],
      education: [{ degree: '', field: '', institution: '', year: '', cgpa: '' }],
      experience: [{ company: '', title: '', from: '', to: '', description: '' }],
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'skills' });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: 'education' });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: 'experience' });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size < 10 * 1024 || file.size > 2 * 1024 * 1024) {
      toast.error('File must be between 10KB and 2MB');
      return;
    }

    try {
      const url = await uploadProfileImage(file);
      setValue('profileImage', url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
      <h2>Personal Information</h2>
      <input placeholder="First Name" {...register('firstName')} />
      <p>{errors.firstName?.message}</p>

      <input placeholder="Last Name" {...register('lastName')} />
      <p>{errors.lastName?.message}</p>

      <input placeholder="Email" {...register('email')} />
      <p>{errors.email?.message}</p>

      <input placeholder="Phone Number" {...register('phone')} />
      <p>{errors.phone?.message}</p>

      <input type="date" {...register('dob')} />
      <p>{errors.dob?.message}</p>

      <select {...register('gender')}>
        <option value="">Select Gender</option>
        {GENDER_OPTIONS.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <p>{errors.gender?.message}</p>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <h2>Address</h2>
      <input placeholder="City" {...register('city')} />
      <p>{errors.city?.message}</p>

      <input placeholder="State/Province" {...register('state')} />
      <p>{errors.state?.message}</p>

      <select {...register('country')}>
        <option value="">Select Country</option>
        {COUNTRY_OPTIONS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <p>{errors.country?.message}</p>

      <input placeholder="Postal Code" {...register('postalCode')} />
      <p>{errors.postalCode?.message}</p>

      <h2>Professional</h2>
      <textarea placeholder="Summary" {...register('summary')} />
      <input placeholder="Years of Experience" type="number" {...register('experienceYears')} />
      <input placeholder="Current Salary" type="number" {...register('currentSalary')} />
      <input placeholder="Expected Salary" type="number" {...register('expectedSalary')} />

      <h3>Skills</h3>
      {skillFields.map((field, index) => (
        <div key={field.id}>
          <input placeholder="Skill Name" {...register(`skills.${index}.name`)} />
          <input placeholder="Proficiency" {...register(`skills.${index}.level`)} />
          <input placeholder="Years" {...register(`skills.${index}.years`)} />
          <button type="button" onClick={() => removeSkill(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => appendSkill({ name: '', level: '', years: '' })}>Add Skill</button>

      <h3>Education</h3>
      {eduFields.map((field, index) => (
        <div key={field.id}>
          <input placeholder="Degree" {...register(`education.${index}.degree`)} />
          <input placeholder="Field" {...register(`education.${index}.field`)} />
          <input placeholder="Institution" {...register(`education.${index}.institution`)} />
          <input placeholder="Year" {...register(`education.${index}.year`)} />
          <input placeholder="CGPA" {...register(`education.${index}.cgpa`)} />
          <button type="button" onClick={() => removeEdu(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => appendEdu({ degree: '', field: '', institution: '', year: '', cgpa: '' })}>Add Education</button>

      <h3>Experience</h3>
      {expFields.map((field, index) => (
        <div key={field.id}>
          <input placeholder="Company" {...register(`experience.${index}.company`)} />
          <input placeholder="Title" {...register(`experience.${index}.title`)} />
          <input placeholder="From" type="date" {...register(`experience.${index}.from`)} />
          <input placeholder="To" type="date" {...register(`experience.${index}.to`)} />
          <textarea placeholder="Description" {...register(`experience.${index}.description`)} />
          <button type="button" onClick={() => removeExp(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => appendExp({ company: '', title: '', from: '', to: '', description: '' })}>Add Experience</button>

      <button type="submit" disabled={isSubmitting}>Submit</button>
    </form>
  );
};

export default ProfileForm;
