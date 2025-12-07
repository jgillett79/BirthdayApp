import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFamilyMembers, createFamilyMember } from '../services/familyMembers';
import { Plus, Users, AlertCircle } from 'lucide-react';
import { CreateFamilyMember } from '@shared/types';

export default function FamilyMembers() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: familyMembers, isLoading, error } = useQuery({
    queryKey: ['familyMembers'],
    queryFn: getFamilyMembers,
  });

  const createMutation = useMutation({
    mutationFn: createFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
      setShowModal(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed to load family members
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      <div className="card">
        {!familyMembers || familyMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No family members yet</h3>
            <p className="text-gray-500 mb-4">Add your family members to organize events better</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Add Your First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <FamilyMemberModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}
    </div>
  );
}

function FamilyMemberModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: CreateFamilyMember) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Family Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Emma"
            />
          </div>

          <div>
            <label className="label">Relationship</label>
            <input
              type="text"
              required
              className="input"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              placeholder="Daughter, Son, Spouse, etc."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
