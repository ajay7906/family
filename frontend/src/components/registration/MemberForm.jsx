import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '../../validation/schemas';
import { Relationship, MaritalStatus, Gender, BloodGroup, Occupation } from '../../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const PhotoUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const MemberForm = ({ member = null, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(member?.photo_base64 || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name || '',
      relationship_to_head: member?.relationship_to_head || Relationship.SON,
      marital_status: member?.marital_status || MaritalStatus.SINGLE,
      gender: member?.gender || Gender.MALE,
      blood_group: member?.blood_group || BloodGroup.A_POSITIVE,
      dob: member?.dob || '',
      doa: member?.doa || '',
      spouse_name: member?.spouse_name || '',
      occupation: member?.occupation || Occupation.STUDENT,
      occupation_details: member?.occupation_details || '',
      mobile: member?.mobile || '',
      email: member?.email || '',
      photo_base64: member?.photo_base64 || ''
    }
  });

  const maritalStatus = watch('marital_status');
  const occupation = watch('occupation');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setValue('photo_base64', base64, { shouldValidate: true });
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    // give unique id if new
    const finalData = member ? { ...member, ...data } : { ...data, id: Date.now().toString() };

    onSave(finalData); // parent handles add/edit
    reset();
    setPhotoPreview('');
    onClose(); // close form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      <h4 className="text-lg font-medium mb-2">{member ? 'Edit Member' : 'Add New Member'}</h4>

      {/* Basic Info */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-grow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Full Name" {...register('name')} error={errors.name?.message} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <select {...register('relationship_to_head')} className="block w-full px-3 py-2 border rounded-md shadow-sm">
                {Object.values(Relationship).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select {...register('gender')} className="block w-full px-3 py-2 border rounded-md shadow-sm">
                {Object.values(Gender).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <div
            className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Member Photo" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center">
                <PhotoUploadIcon />
                <span className="mt-1 text-xs text-gray-500">Upload</span>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
        </div>
      </div>

      {/* DOB, Marital, Blood Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Date of Birth" type="date" {...register('dob')} error={errors.dob?.message} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
          <select {...register('marital_status')} className="block w-full px-3 py-2 border rounded-md shadow-sm">
            {Object.values(MaritalStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          <select {...register('blood_group')} className="block w-full px-3 py-2 border rounded-md shadow-sm">
            {Object.values(BloodGroup).map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Spouse Details */}
      {maritalStatus === MaritalStatus.MARRIED && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-blue-50 rounded-md border">
          <Input label="Spouse Name" {...register('spouse_name')} error={errors.spouse_name?.message} />
          <Input label="Date of Anniversary" type="date" {...register('doa')} error={errors.doa?.message} />
        </div>
      )}

      {/* Occupation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
          <select {...register('occupation')} className="block w-full px-3 py-2 border rounded-md shadow-sm">
            {Object.values(Occupation).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <Input label="Mobile Number (Optional)" type="tel" {...register('mobile')} error={errors.mobile?.message} />
        <Input label="Email (Optional)" type="email" {...register('email')} error={errors.email?.message} />
      </div>

      {/* Occupation details */}
      {[Occupation.BUSINESS, Occupation.SERVICE].includes(occupation) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business / Service Details</label>
          <textarea
            {...register('occupation_details')}
            rows={3}
            className="block w-full px-3 py-2 border rounded-md shadow-sm"
            placeholder="e.g., Owner of a retail store, or Software Engineer at..."
          />
          {errors.occupation_details && (
            <p className="mt-1 text-sm text-red-600">{errors.occupation_details.message}</p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md">
          {member ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
};
