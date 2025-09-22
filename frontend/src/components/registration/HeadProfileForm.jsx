// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Input } from '../ui/Input';
// import { Button } from '../ui/Button';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
// import { indianStates } from '../../data/locations';

// const Occupation = {
//   BUSINESS: 'Business',
//   SERVICE: 'Service',
//   STUDENT: 'Student',
//   RETIRED: 'Retired',
//   OTHER: 'Other',
// };

// const headProfileSchema = z.object({
//   head_name: z.string().min(3, 'Full name is required'),
//   occupation: z.string().nonempty('Occupation is required'),
//   occupation_details: z.string().optional(),
//   email: z.string().email('Invalid email').optional(),
//   address_line1: z.string().min(3, 'Address line 1 is required'),
//   address_line2: z.string().optional(),
//   city: z.string().nonempty('City is required'),
//   state: z.string().nonempty('State is required'),
//   pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
//   block: z.string().nonempty('Block is required'),
//   flat_no: z.string().nonempty('Flat / House No. is required'),
//   head_mobile: z.string().nonempty('Mobile is required'),
// });

// export default function HeadProfileForm({ familyData = {}, onNext }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue
//   } = useForm({
//     resolver: zodResolver(headProfileSchema),
//     defaultValues: {
//       head_name: familyData.head_name || '',
//       occupation: familyData.occupation || Occupation.OTHER,
//       occupation_details: familyData.occupation_details || '',
//       email: familyData.email || '',
//       address_line1: familyData.address_line1 || '',
//       address_line2: familyData.address_line2 || '',
//       city: familyData.city || '',
//       state: familyData.state || '',
//       pincode: familyData.pincode || '',
//       block: familyData.block || '',
//       flat_no: familyData.flat_no || '',
//       head_mobile: familyData.head_mobile || '', 
//     }
//   });

//   const occupation = watch('occupation');
//   const selectedState = watch('state');

//   useEffect(() => {
//     setValue('city', '');
//   }, [selectedState, setValue]);

//   useEffect(() => {
//     const savedMobile = localStorage.getItem('mobile');
//     if (savedMobile) setValue('head_mobile', savedMobile);
//   }, [setValue]);

//   const onSubmit = (data) => {
//     console.log('Form submitted:', data);
//     alert('Profile saved successfully!');
//     if (typeof onNext === 'function') onNext(data); // ✅ Send form data to parent
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-2xl font-bold text-blue-700 mb-6">Step 1: Head Profile</h2>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Card>
//             <CardHeader className="bg-blue-50 border-b border-blue-200 rounded-t-lg px-6 py-4">
//               <CardTitle className="text-lg font-semibold text-blue-800">Head of Family Profile</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-6 px-6 py-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Input id="head_name" label="Full Name" {...register('head_name')} error={errors.head_name?.message} />
//                 <Input
//                   id="head_mobile"
//                   label="Mobile Number"
//                   {...register('head_mobile')}
//                   value={watch('head_mobile')}
//                   disabled
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
//                   <select
//                     id="occupation"
//                     {...register('occupation')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   >
//                     {Object.values(Occupation).map((o) => (
//                       <option key={o} value={o}>{o}</option>
//                     ))}
//                   </select>
//                   {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>}
//                 </div>
//                 <Input id="email" label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
//               </div>

//               {[Occupation.BUSINESS, Occupation.SERVICE].includes(occupation) && (
//                 <div>
//                   <label htmlFor="occupation_details" className="block text-sm font-medium text-gray-700 mb-1">
//                     Business / Service Details
//                   </label>
//                   <textarea
//                     id="occupation_details"
//                     {...register('occupation_details')}
//                     rows={3}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     placeholder="e.g., Retail shop owner or Software Engineer..."
//                   />
//                   {errors.occupation_details && (
//                     <p className="mt-1 text-sm text-red-600">{errors.occupation_details.message}</p>
//                   )}
//                 </div>
//               )}

//               <hr />
//               <h4 className="text-md font-semibold text-gray-800">Address</h4>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Input id="address_line1" label="Address Line 1" {...register('address_line1')} error={errors.address_line1?.message} />
//                 <Input id="address_line2" label="Address Line 2 (Optional)" {...register('address_line2')} error={errors.address_line2?.message} />

//                 <div>
//                   <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                   <select
//                     id="state"
//                     {...register('state')}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   >
//                     <option value="">Select State</option>
//                     {Object.keys(indianStates).sort().map((state) => (
//                       <option key={state} value={state}>{state}</option>
//                     ))}
//                   </select>
//                   {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
//                 </div>

//                 <div>
//                   <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                   <select
//                     id="city"
//                     {...register('city')}
//                     disabled={!selectedState}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//                   >
//                     <option value="">Select City</option>
//                     {selectedState && indianStates[selectedState]?.sort().map((city) => (
//                       <option key={city} value={city}>{city}</option>
//                     ))}
//                   </select>
//                   {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
//                 </div>

//                 <Input id="pincode" label="Pincode" {...register('pincode')} error={errors.pincode?.message} />
//                 <Input id="block" label="Block / Wing" {...register('block')} error={errors.block?.message} />
//                 <Input id="flat_no" label="Flat / House No." {...register('flat_no')} error={errors.flat_no?.message} />
//               </div>
//             </CardContent>

//             <CardFooter className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-lg">
//               <Button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               >
//                 Save & Continue
//               </Button>
//             </CardFooter>
//           </Card>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { indianStates } from '../../data/locations';

const Occupation = {
  BUSINESS: 'Business',
  SERVICE: 'Service',
  STUDENT: 'Student',
  RETIRED: 'Retired',
  OTHER: 'Other',
};

const headProfileSchema = z.object({
  head_name: z.string().min(3, 'Full name is required'),
  occupation: z.string().nonempty('Occupation is required'),
  occupation_details: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  address_line1: z.string().min(3, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  city: z.string().nonempty('City is required'),
  state: z.string().nonempty('State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  block: z.string().nonempty('Block is required'),
  flat_no: z.string().nonempty('Flat / House No. is required'),
  head_mobile: z.string().nonempty('Mobile is required'),
});

export default function HeadProfileForm({ familyData = {}, onNext }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(headProfileSchema),
    defaultValues: {
      head_name: familyData.head_name || '',
      occupation: familyData.occupation || Occupation.OTHER,
      occupation_details: familyData.occupation_details || '',
      email: familyData.email || '',
      address_line1: familyData.address_line1 || '',
      address_line2: familyData.address_line2 || '',
      city: familyData.city || '',
      state: familyData.state || '',
      pincode: familyData.pincode || '',
      block: familyData.block || '',
      flat_no: familyData.flat_no || '',
      head_mobile: familyData.head_mobile || '', 
    }
  });

  const occupation = watch('occupation');
  const selectedState = watch('state');

  useEffect(() => {
    setValue('city', '');
  }, [selectedState, setValue]);

  useEffect(() => {
    const savedMobile = localStorage.getItem('mobile');
    if (savedMobile) setValue('head_mobile', savedMobile);
  }, [setValue]);

  // API call function
  const submitRegistration = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Prepare the data for API - include empty members array as per your controller
      const registrationData = {
        ...formData,
        members: [] // You can add family members later in subsequent steps
      };

      const response = await fetch('http://localhost:5000/api/registration/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      console.log('Registration successful:', result);
      
      // Store family ID for future use
      if (result.familyId) {
        localStorage.setItem('familyId', result.familyId);
      }

      alert('Profile saved successfully!');
      
      // Pass the result data to parent component
      if (typeof onNext === 'function') {
        onNext({ ...formData, familyId: result.familyId });
      }

      return result;

    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.message || 'Failed to save profile. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await submitRegistration(data);
    } catch (error) {
      // Error is already handled in submitRegistration
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Step 1: Head Profile</h2>

        {submitError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="bg-blue-50 border-b border-blue-200 rounded-t-lg px-6 py-4">
              <CardTitle className="text-lg font-semibold text-blue-800">Head of Family Profile</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="head_name" label="Full Name" {...register('head_name')} error={errors.head_name?.message} />
                <Input
                  id="head_mobile"
                  label="Mobile Number"
                  {...register('head_mobile')}
                  value={watch('head_mobile')}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <select
                    id="occupation"
                    {...register('occupation')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {Object.values(Occupation).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>}
                </div>
                <Input id="email" label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
              </div>

              {[Occupation.BUSINESS, Occupation.SERVICE].includes(occupation) && (
                <div>
                  <label htmlFor="occupation_details" className="block text-sm font-medium text-gray-700 mb-1">
                    Business / Service Details
                  </label>
                  <textarea
                    id="occupation_details"
                    {...register('occupation_details')}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Retail shop owner or Software Engineer..."
                  />
                  {errors.occupation_details && (
                    <p className="mt-1 text-sm text-red-600">{errors.occupation_details.message}</p>
                  )}
                </div>
              )}

              <hr />
              <h4 className="text-md font-semibold text-gray-800">Address</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="address_line1" label="Address Line 1" {...register('address_line1')} error={errors.address_line1?.message} />
                <Input id="address_line2" label="Address Line 2 (Optional)" {...register('address_line2')} error={errors.address_line2?.message} />

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    id="state"
                    {...register('state')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select State</option>
                    {Object.keys(indianStates).sort().map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    id="city"
                    {...register('city')}
                    disabled={!selectedState}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {selectedState && indianStates[selectedState]?.sort().map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>

                <Input id="pincode" label="Pincode" {...register('pincode')} error={errors.pincode?.message} />
                <Input id="block" label="Block / Wing" {...register('block')} error={errors.block?.message} />
                <Input id="flat_no" label="Flat / House No." {...register('flat_no')} error={errors.flat_no?.message} />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-lg">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}