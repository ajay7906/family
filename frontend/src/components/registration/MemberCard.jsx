import React, { useState } from 'react';
import { AlertDialog } from '../ui/AlertDialog';
import { Button } from '../ui/Button';

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MemberCard = ({ member, onEdit, onDelete }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const isSelf = member.relationship_to_head === 'Self';

  const handleDelete = () => {
    onDelete(member.id); // ✅ call parent handler
    setIsAlertOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {member.photo_base64 ? (
          <img src={member.photo_base64} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <UserIcon />
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-bold text-gray-800">
          {member.name}{' '}
          <span className="text-sm font-normal text-gray-500 ml-2">({member.relationship_to_head})</span>
        </h4>
        <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <span><strong>Gender:</strong> {member.gender}</span>
          <span><strong>DOB:</strong> {member.dob}</span>
          <span><strong>Status:</strong> {member.marital_status}</span>
          <span><strong>Blood:</strong> {member.blood_group}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center">
        <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
          <PencilIcon />
        </Button>
        {!isSelf && (
          <Button variant="danger" size="sm" onClick={() => setIsAlertOpen(true)}>
            <TrashIcon />
          </Button>
        )}
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Delete Member"
        confirmText="Delete"
        isConfirming={false}
      >
        Are you sure you want to delete {member.name}? This action cannot be undone.
      </AlertDialog>
    </div>
  );
};
