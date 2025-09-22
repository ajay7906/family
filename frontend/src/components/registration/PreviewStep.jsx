// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../ui/Button';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';

// const InfoRow = ({ label, value }) => {
//   if (!value) return null;
//   return (
//     <div className="grid grid-cols-3 gap-4 py-1">
//       <dt className="text-sm font-medium text-gray-500">{label}</dt>
//       <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
//     </div>
//   );
// };

// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
//     <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const PreviewStep = ({ familyData = {}, onBack }) => {
//   const [submitted, setSubmitted] = useState(false);
//   const navigate = useNavigate();

//   // Ensure familyData fields exist
//   const {
//     head_name = '',
//     head_mobile = '',
//     email = '',
//     occupation = '',
//     occupation_details = '',
//     flat_no = '',
//     block = '',
//     address_line1 = '',
//     city = '',
//     state = '',
//     pincode = '',
//     members = [],
//     status = ''
//   } = familyData;

//   const formattedMobile = head_mobile ? head_mobile.replace(/^\+91/, '') : '';

//   const handleLogout = () => {
//     localStorage.removeItem('mobile');
//     localStorage.removeItem('otp');
//     navigate('/');
//   };

//   if (status === 'APPROVED') {
//     return (
//       <div className="text-center py-12 bg-green-50 border-2 border-green-200 rounded-lg space-y-4">
//         <h2 className="text-2xl font-bold text-green-800">Application Approved!</h2>
//         <p className="mt-2 text-green-600">Your family details have been approved. No further action is needed.</p>
//         <Button variant="secondary" onClick={handleLogout}>Logout</Button>
//       </div>
//     );
//   }

//   if (submitted) {
//     return (
//       <div className="text-center py-12 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
//         <h2 className="text-2xl font-bold text-blue-800">Application Submitted!</h2>
//         <p className="mt-2 text-blue-600">Thank you for submitting your application. It is now pending review.</p>
//         <Button variant="secondary" onClick={handleLogout}>Logout</Button>
//       </div>
//     );
//   }

//   const headOccupation = occupation + (occupation_details ? ` (${occupation_details})` : '');

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Preview & Submit Application</CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-8">
//         {/* Head of Family */}
//         <div>
//           <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Head of Family Details</h4>
//           <dl className="divide-y divide-gray-200">
//             <InfoRow label="Full Name" value={head_name} />
//             <InfoRow label="Mobile" value={formattedMobile} />
//             <InfoRow label="Email" value={email} />
//             <InfoRow label="Occupation" value={headOccupation} />
//             <InfoRow
//               label="Address"
//               value={`${flat_no}, ${block}, ${address_line1}, ${city}, ${state} - ${pincode}`}
//             />
//           </dl>
//         </div>

//         {/* Family Members */}
//         <div>
//           <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Family Members</h4>
//           {members.length > 0 ? (
//             <div className="space-y-4">
//               {members.map((member) => {
//                 const memberOccupation = member.occupation + (member.occupation_details ? ` (${member.occupation_details})` : '');
//                 return (
//                   <div key={member.id} className="p-3 bg-gray-50 rounded-md border flex gap-4">
//                     <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                       {member.photo_base64 ? (
//                         <img src={member.photo_base64} alt={member.name} className="w-full h-full object-cover" />
//                       ) : (
//                         <UserIcon />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h5 className="font-semibold">
//                         {member.name} <span className="font-normal text-gray-500 text-sm">({member.relationship_to_head})</span>
//                       </h5>
//                       <dl className="mt-2 divide-y divide-gray-200">
//                         <InfoRow label="Gender" value={member.gender} />
//                         <InfoRow label="DOB" value={member.dob} />
//                         {member.doa && <InfoRow label="DOA" value={member.doa} />}
//                         {member.spouse_name && <InfoRow label="Spouse Name" value={member.spouse_name} />}
//                         <InfoRow label="Occupation" value={memberOccupation} />
//                         <InfoRow label="Blood Group" value={member.blood_group} />
//                         <InfoRow label="Marital Status" value={member.marital_status} />
//                         {member.mobile && <InfoRow label="Mobile" value={member.mobile} />}
//                         {member.email && <InfoRow label="Email" value={member.email} />}
//                       </dl>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="text-gray-500">No family members added.</p>
//           )}
//         </div>
//       </CardContent>

//       <CardFooter className="flex justify-between">
//         <Button variant="secondary" onClick={onBack}>Back</Button>
//         <div className="flex gap-2">
//           <Button variant="secondary" onClick={handleLogout}>Logout</Button>
//           <Button
//             onClick={() => setSubmitted(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
//           >
//             Confirm & Submit
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PreviewStep;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-4 py-1">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PreviewStep = ({ familyData = {}, onBack, onSubmit, loading = false }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  // Ensure familyData fields exist
  const {
    head_name = '',
    head_mobile = '',
    email = '',
    occupation = '',
    occupation_details = '',
    flat_no = '',
    block = '',
    address_line1 = '',
    address_line2 = '',
    city = '',
    state = '',
    pincode = '',
    members = [],
    status = ''
  } = familyData;

  const formattedMobile = head_mobile ? head_mobile.replace(/^\+91/, '') : '';

  const handleLogout = () => {
    localStorage.removeItem('mobile');
    localStorage.removeItem('otp');
    navigate('/');
  };

  const handleSubmit = async () => {
    setSubmitError('');
    try {
      const success = await onSubmit();
      if (success) {
        setSubmitted(true);
      }
    } catch (error) {
      setSubmitError('Failed to submit application. Please try again.');
      console.error('Submission error:', error);
    }
  };

  if (status === 'APPROVED') {
    return (
      <div className="text-center py-12 bg-green-50 border-2 border-green-200 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold text-green-800">Application Approved!</h2>
        <p className="mt-2 text-green-600">Your family details have been approved. No further action is needed.</p>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-12 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">Application Submitted!</h2>
        <p className="mt-2 text-blue-600">Thank you for submitting your application. It is now pending review.</p>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  const headOccupation = occupation + (occupation_details ? ` (${occupation_details})` : '');
  
  // Format address
  const addressParts = [flat_no, block, address_line1, address_line2, city, state, pincode].filter(Boolean);
  const formattedAddress = addressParts.join(', ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview & Submit Application</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Head of Family */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Head of Family Details</h4>
          <dl className="divide-y divide-gray-200">
            <InfoRow label="Full Name" value={head_name} />
            <InfoRow label="Mobile" value={formattedMobile} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="Occupation" value={headOccupation} />
            <InfoRow label="Address" value={formattedAddress} />
          </dl>
        </div>

        {/* Family Members */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Family Members</h4>
          {members && members.length > 0 ? (
            <div className="space-y-4">
              {members.map((member, index) => {
                const memberOccupation = member.occupation + (member.occupation_details ? ` (${member.occupation_details})` : '');
                return (
                  <div key={member.id || index} className="p-3 bg-gray-50 rounded-md border flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.photo_base64 ? (
                        <img src={member.photo_base64} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">
                        {member.name} <span className="font-normal text-gray-500 text-sm">({member.relationship_to_head || member.relation})</span>
                      </h5>
                      <dl className="mt-2 divide-y divide-gray-200">
                        <InfoRow label="Gender" value={member.gender} />
                        <InfoRow label="Age" value={member.age} />
                        {member.dob && <InfoRow label="DOB" value={member.dob} />}
                        {member.doa && <InfoRow label="DOA" value={member.doa} />}
                        {member.spouse_name && <InfoRow label="Spouse Name" value={member.spouse_name} />}
                        <InfoRow label="Occupation" value={memberOccupation} />
                        <InfoRow label="Blood Group" value={member.blood_group} />
                        <InfoRow label="Marital Status" value={member.marital_status} />
                        {member.mobile && <InfoRow label="Mobile" value={member.mobile} />}
                        {member.email && <InfoRow label="Email" value={member.email} />}
                      </dl>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No family members added.</p>
          )}
        </div>

        {/* Error message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {submitError}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button 
          variant="secondary" 
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PreviewStep;