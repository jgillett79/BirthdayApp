import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGiftIdeas, createGiftIdea, updateGiftIdea, deleteGiftIdea } from '../services/gifts';
import { getEvents } from '../services/events';
import { Plus, Trash2, Gift, AlertCircle, Pencil, Check, ExternalLink } from 'lucide-react';
import { CreateGiftIdea, GiftIdea, Event } from '@shared/types';

export default function GiftIdeas() {
  const [showModal, setShowModal] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftIdea | null>(null);
  const [filterEventId, setFilterEventId] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: gifts, isLoading, error } = useQuery({
    queryKey: ['gifts'],
    queryFn: () => getGiftIdeas(),
  });

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const createMutation = useMutation({
    mutationFn: createGiftIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGiftIdea> & { purchased?: boolean } }) =>
      updateGiftIdea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      setShowModal(false);
      setEditingGift(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGiftIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });

  const togglePurchased = (gift: GiftIdea) => {
    updateMutation.mutate({
      id: gift.id,
      data: { purchased: !gift.purchased },
    });
  };

  const handleEdit = (gift: GiftIdea) => {
    setEditingGift(gift);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGift(null);
  };

  const filteredGifts = useMemo(() => {
    if (!gifts) return [];
    if (filterEventId === 'all') return gifts;
    return gifts.filter(gift => gift.eventId === filterEventId);
  }, [gifts, filterEventId]);

  const giftsByEvent = useMemo(() => {
    const grouped = new Map<string, GiftIdea[]>();
    filteredGifts.forEach(gift => {
      const eventGifts = grouped.get(gift.eventId) || [];
      eventGifts.push(gift);
      grouped.set(gift.eventId, eventGifts);
    });
    return grouped;
  }, [filteredGifts]);

  const getEventName = (eventId: string) => {
    return events?.find(e => e.id === eventId)?.name || 'Unknown Event';
  };

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
        Failed to load gift ideas
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gift Ideas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Gift Idea
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Event:</label>
          <select
            className="input flex-1 max-w-md"
            value={filterEventId}
            onChange={(e) => setFilterEventId(e.target.value)}
          >
            <option value="all">All Events</option>
            {events?.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-600">
            {filteredGifts.length} idea{filteredGifts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {!gifts || gifts.length === 0 ? (
        <div className="card text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gift ideas yet</h3>
          <p className="text-gray-500 mb-4">Start tracking gift ideas for upcoming events</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Add Your First Gift Idea
          </button>
        </div>
      ) : filteredGifts.length === 0 ? (
        <div className="card text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gift ideas for this event</h3>
          <p className="text-gray-500 mb-4">Add some gift ideas to get started</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Add Gift Idea
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(giftsByEvent.entries()).map(([eventId, eventGifts]) => (
            <div key={eventId} className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{getEventName(eventId)}</h2>
              <div className="space-y-3">
                {eventGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      gift.purchased
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${gift.purchased ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                            {gift.idea}
                          </h3>
                          {gift.purchased && (
                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                              Purchased
                            </span>
                          )}
                        </div>
                        {gift.price && (
                          <p className="text-sm text-gray-600 mt-1">${gift.price.toFixed(2)}</p>
                        )}
                        {gift.notes && (
                          <p className="text-sm text-gray-600 mt-1">{gift.notes}</p>
                        )}
                        {gift.url && (
                          <a
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-800 mt-1 inline-flex items-center"
                          >
                            View product <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => togglePurchased(gift)}
                          className={`p-2 rounded-md transition-colors ${
                            gift.purchased
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-gray-400 hover:bg-gray-200'
                          }`}
                          title={gift.purchased ? 'Mark as not purchased' : 'Mark as purchased'}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(gift)}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-md"
                          title="Edit gift idea"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(gift.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                          disabled={deleteMutation.isPending}
                          title="Delete gift idea"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <GiftIdeaModal
          onClose={handleCloseModal}
          onSubmit={(data) => {
            if (editingGift) {
              updateMutation.mutate({ id: editingGift.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          events={events || []}
          isLoading={createMutation.isPending || updateMutation.isPending}
          editingGift={editingGift}
        />
      )}
    </div>
  );
}

function GiftIdeaModal({
  onClose,
  onSubmit,
  events,
  isLoading,
  editingGift,
}: {
  onClose: () => void;
  onSubmit: (data: CreateGiftIdea) => void;
  events: Event[];
  isLoading: boolean;
  editingGift?: GiftIdea | null;
}) {
  const [formData, setFormData] = useState({
    eventId: editingGift?.eventId || '',
    idea: editingGift?.idea || '',
    price: editingGift?.price?.toString() || '',
    url: editingGift?.url || '',
    notes: editingGift?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventId: formData.eventId,
      idea: formData.idea,
      price: formData.price ? parseFloat(formData.price) : undefined,
      url: formData.url || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editingGift ? 'Edit Gift Idea' : 'Add New Gift Idea'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Event</label>
            <select
              required
              className="input"
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Gift Idea</label>
            <input
              type="text"
              required
              className="input"
              value={formData.idea}
              onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
              placeholder="Book, Watch, etc."
            />
          </div>

          <div>
            <label className="label">Price (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="29.99"
            />
          </div>

          <div>
            <label className="label">Product URL (Optional)</label>
            <input
              type="url"
              className="input"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              className="input"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Size preferences, color choices, etc."
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
              {isLoading ? (editingGift ? 'Updating...' : 'Adding...') : (editingGift ? 'Update Gift' : 'Add Gift')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
