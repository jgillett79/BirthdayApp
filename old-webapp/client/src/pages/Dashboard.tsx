import { useQuery } from '@tanstack/react-query';
import { getUpcomingEvents, getEvents } from '../services/events';
import { getGiftIdeas } from '../services/gifts';
import { getFamilyMembers } from '../services/familyMembers';
import { Calendar, Gift, AlertCircle, Users, Cake, Heart, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { EventType } from '@shared/types';
import { useNavigate } from 'react-router-dom';

// Helper function to calculate age
const calculateAge = (birthYear: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: upcomingEvents, isLoading, error } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: () => getUpcomingEvents(30),
  });

  const { data: allEvents } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const { data: gifts } = useQuery({
    queryKey: ['gifts'],
    queryFn: () => getGiftIdeas(),
  });

  const { data: familyMembers } = useQuery({
    queryKey: ['familyMembers'],
    queryFn: getFamilyMembers,
  });

  // Calculate statistics
  const stats = {
    totalEvents: allEvents?.length || 0,
    birthdays: allEvents?.filter(e => e.type === EventType.BIRTHDAY).length || 0,
    anniversaries: allEvents?.filter(e => e.type === EventType.ANNIVERSARY).length || 0,
    totalGifts: gifts?.length || 0,
    purchasedGifts: gifts?.filter(g => g.purchased).length || 0,
    familyCount: familyMembers?.length || 0,
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
        Failed to load upcoming events
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <button
          onClick={() => navigate('/events')}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 text-pink-600">
              <Cake className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Birthdays</p>
              <p className="text-2xl font-bold text-gray-900">{stats.birthdays}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <Heart className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Anniversaries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.anniversaries}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Family Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.familyCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents?.filter(e => e.daysUntil <= 7).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tomorrow</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents?.filter(e => e.daysUntil === 1).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Gift className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gift Ideas</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.purchasedGifts}/{stats.totalGifts}
              </p>
              <p className="text-xs text-gray-500">purchased</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/events')}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Event</span>
          </button>
          <button
            onClick={() => navigate('/family')}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Users className="w-6 h-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Family</span>
          </button>
          <button
            onClick={() => navigate('/gifts')}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Gift className="w-6 h-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Gift Ideas</span>
          </button>
          <button
            onClick={() => navigate('/events')}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">View All</span>
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
        {!upcomingEvents || upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming events in the next 30 days</p>
            <p className="text-sm text-gray-400 mt-1">Add some birthdays or anniversaries to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    event.daysUntil === 0 ? 'bg-red-100 text-red-600' :
                    event.daysUntil <= 3 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      {event.type === EventType.BIRTHDAY && event.birthYear && ` • Turning ${calculateAge(event.birthYear)}`}
                      {event.familyMember && ` • ${event.familyMember.name}'s ${event.relationshipToMember}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {event.daysUntil === 0 ? 'Today!' :
                     event.daysUntil === 1 ? 'Tomorrow' :
                     `In ${event.daysUntil} days`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(parseISO(event.date.toString()), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
