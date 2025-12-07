import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGiftIdeas, createGiftIdea, updateGiftIdea, deleteGiftIdea, getGiftSuggestions } from '../services/gifts';
import { getEvents } from '../services/events';
import { Plus, Trash2, Gift, AlertCircle, Pencil, Check, ExternalLink, Sparkles } from 'lucide-react';
import { CreateGiftIdea, GiftIdea, Event, GiftSuggestion } from '@shared/types';

export default function GiftIdeas() {
  const [showModal, setShowModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
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
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSuggestionsModal(true)}
            className="btn-secondary flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get AI Suggestions
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Gift Idea
          </button>
        </div>
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

      {showSuggestionsModal && (
        <AISuggestionsModal
          onClose={() => setShowSuggestionsModal(false)}
          onSaveSuggestion={(suggestion, eventId) => {
            createMutation.mutate({
              eventId,
              idea: suggestion.idea,
              price: suggestion.estimatedPrice,
              notes: `${suggestion.description}\n\nReasoning: ${suggestion.reasoning}`,
            });
          }}
          events={events || []}
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

function AISuggestionsModal({
  onClose,
  onSaveSuggestion,
  events,
}: {
  onClose: () => void;
  onSaveSuggestion: (suggestion: GiftSuggestion, eventId: string) => void;
  events: Event[];
}) {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    eventId: '',
    personName: '',
    age: '',
    interests: '',
    relationship: '',
    priceMin: '',
    priceMax: '',
  });

  const handleGetSuggestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const event = events.find(e => e.id === formData.eventId);
      const suggestionsData = await getGiftSuggestions({
        eventId: formData.eventId,
        personName: formData.personName || event?.name || 'Person',
        age: formData.age ? parseInt(formData.age) : undefined,
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : undefined,
        relationship: formData.relationship || undefined,
        priceRange: formData.priceMin && formData.priceMax ? {
          min: parseFloat(formData.priceMin),
          max: parseFloat(formData.priceMax),
        } : undefined,
      });

      setSuggestions(suggestionsData);
      setStep('results');
    } catch (err) {
      setError('Failed to get suggestions. Please try again.');
      console.error('AI suggestions error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuggestion = (suggestion: GiftSuggestion) => {
    onSaveSuggestion(suggestion, formData.eventId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        {step === 'form' ? (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
              Get AI Gift Suggestions
            </h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleGetSuggestions} className="space-y-4">
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
                <label className="label">Person's Name (Optional)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="label">Age (Optional)</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  className="input"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                />
              </div>

              <div>
                <label className="label">Interests (Optional, comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="reading, hiking, cooking"
                />
              </div>

              <div>
                <label className="label">Relationship (Optional)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="friend, colleague, family"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Price (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={formData.priceMin}
                    onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="label">Max Price (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={formData.priceMax}
                    onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                    placeholder="50"
                  />
                </div>
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
                  {isLoading ? 'Getting Suggestions...' : 'Get Suggestions'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
              AI Gift Suggestions
            </h2>

            <div className="space-y-4 mb-6">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{suggestion.idea}</h3>
                    <span className="text-primary-600 font-semibold">${suggestion.estimatedPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{suggestion.description}</p>
                  <p className="text-sm text-gray-600 italic">💡 {suggestion.reasoning}</p>
                  <button
                    onClick={() => handleSaveSuggestion(suggestion)}
                    className="mt-3 btn-primary text-sm"
                  >
                    Save to Gift Ideas
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep('form')}
                className="btn-secondary flex-1"
              >
                Get More Suggestions
              </button>
              <button
                onClick={onClose}
                className="btn-primary flex-1"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
