import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { MemberCard } from './MemberCard';
import { MemberForm } from './MemberForm';
import { v4 as uuidv4 } from 'uuid';

const MembersStep = ({ familyData = { members: [], id: '' }, onNext, onBack }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [localMembers, setLocalMembers] = useState(familyData.members || []);

  // ✏️ Edit existing
  const handleEdit = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  // ➕ Add new
  const handleAddNew = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  // 💾 Save member (from form)
  const handleSave = (memberData) => {
    const newMember = editingMember
      ? { ...editingMember, ...memberData }
      : { ...memberData, id: uuidv4() }; // assign id if new

    const updatedList = editingMember
      ? localMembers.map((m) => (m.id === newMember.id ? newMember : m))
      : [...localMembers, newMember];

    setLocalMembers(updatedList);
    setIsFormOpen(false);
    setEditingMember(null);
  };

  // ❌ Cancel form
  const handleClose = () => {
    setIsFormOpen(false);
    setEditingMember(null);
  };

  // 🗑️ Delete member
  const handleDelete = (id) => {
    const updatedList = localMembers.filter((m) => m.id !== id);
    setLocalMembers(updatedList);
  };

  return (
    <Card>
      {/* Header */}
      <CardHeader className="bg-blue-50 border-b border-blue-200 px-6 py-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-blue-800">Family Members</CardTitle>
          {!isFormOpen && (
            <Button
              onClick={handleAddNew}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
            >
              Add New Member
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-6 py-6">
        {isFormOpen ? (
          <MemberForm
            familyId={familyData.id}
            member={editingMember}
            onSave={handleSave}
            onClose={handleClose}
          />
        ) : (
          <div className="space-y-4">
            {localMembers.length > 0 ? (
              localMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No members added yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click 'Add New Member' to start.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      {!isFormOpen && (
        <CardFooter className="flex justify-between px-6 py-4 bg-gray-50 rounded-b-lg">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={() => onNext(localMembers)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
          >
            Save & Continue
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MembersStep;
