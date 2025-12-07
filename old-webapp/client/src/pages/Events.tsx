import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/events';
import { getFamilyMembers } from '../services/familyMembers';
import { Plus, Trash2, Calendar, AlertCircle, Pencil, Search, Filter } from 'lucide-react';
import { EventType, CreateEvent, Event } from '@shared/types';
import { format, parseISO } from 'date-fns';

// Helper function to calculate age
const calculateAge = (birthYear: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

export default function Events() {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFamilyMember, setFilterFamilyMember] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const { data: familyMembers } = useQuery({
    queryKey: ['familyMembers'],
    queryFn: getFamilyMembers,
  });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEvent> }) =>
      updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
      setShowModal(false);
      setEditingEvent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  // Filter and search events
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter(event => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType = filterType === 'all' || event.type === filterType;

      // Family member filter
      const matchesFamilyMember = filterFamilyMember === 'all' ||
        event.familyMemberId === filterFamilyMember;

      return matchesSearch && matchesType && matchesFamilyMember;
    });
  }, [events, searchQuery, filterType, filterFamilyMember]);

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
        Failed to load events
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="input pl-10"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="birthday">Birthdays</option>
              <option value="anniversary">Anniversaries</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Family Member Filter */}
          <div>
            <select
              className="input"
              value={filterFamilyMember}
              onChange={(e) => setFilterFamilyMember(e.target.value)}
            >
              <option value="all">All Family Members</option>
              {familyMembers?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredEvents.length} of {events?.length || 0} events
        </div>
      </div>

      <div className="card">
        {!events || events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first birthday or anniversary</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Add Your First Event
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events match your filters</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterFamilyMember('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Related To
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.name}</div>
                      {event.notes && (
                        <div className="text-sm text-gray-500">{event.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{format(parseISO(event.date.toString()), 'MMM dd, yyyy')}</div>
                      {event.type === EventType.BIRTHDAY && event.birthYear && (
                        <div className="text-xs text-gray-500">
                          Turning {calculateAge(event.birthYear)} years old
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.familyMemberId && familyMembers?.find(fm => fm.id === event.familyMemberId)?.name}
                      {event.relationshipToMember && ` (${event.relationshipToMember})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit event"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(event.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteMutation.isPending}
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <EventModal
          onClose={handleCloseModal}
          onSubmit={(data) => {
            if (editingEvent) {
              updateMutation.mutate({ id: editingEvent.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          familyMembers={familyMembers || []}
          isLoading={createMutation.isPending || updateMutation.isPending}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}

function EventModal({
  onClose,
  onSubmit,
  familyMembers,
  isLoading,
  editingEvent,
}: {
  onClose: () => void;
  onSubmit: (data: CreateEvent) => void;
  familyMembers: any[];
  isLoading: boolean;
  editingEvent?: Event | null;
}) {
  const [formData, setFormData] = useState({
    name: editingEvent?.name || '',
    date: editingEvent?.date ? format(parseISO(editingEvent.date.toString()), 'yyyy-MM-dd') : '',
    type: editingEvent?.type || EventType.BIRTHDAY,
    birthYear: editingEvent?.birthYear?.toString() || '',
    familyMemberId: editingEvent?.familyMemberId || '',
    relationshipToMember: editingEvent?.relationshipToMember || '',
    notes: editingEvent?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      familyMemberId: formData.familyMemberId || undefined,
      relationshipToMember: formData.relationshipToMember || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editingEvent ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John's Birthday"
            />
          </div>

          <div>
            <label className="label">Date</label>
            <input
              type="date"
              required
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
            >
              <option value={EventType.BIRTHDAY}>Birthday</option>
              <option value={EventType.ANNIVERSARY}>Anniversary</option>
              <option value={EventType.OTHER}>Other</option>
            </select>
          </div>

          {formData.type === EventType.BIRTHDAY && (
            <div>
              <label className="label">Birth Year (Optional - for age calculation)</label>
              <input
                type="number"
                className="input"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                placeholder="1990"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          )}

          <div>
            <label className="label">Family Member (Optional)</label>
            <select
              className="input"
              value={formData.familyMemberId}
              onChange={(e) => setFormData({ ...formData, familyMemberId: e.target.value })}
            >
              <option value="">None</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.relationship})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Relationship (e.g., friend, colleague)</label>
            <input
              type="text"
              className="input"
              value={formData.relationshipToMember}
              onChange={(e) => setFormData({ ...formData, relationshipToMember: e.target.value })}
              placeholder="friend"
            />
          </div>

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              className="input"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Gift ideas, preferences, etc."
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
              {isLoading ? (editingEvent ? 'Updating...' : 'Adding...') : (editingEvent ? 'Update Event' : 'Add Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
