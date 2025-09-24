// SuperAdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { AlertDialog } from '../components/ui/AlertDialog';

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Service functions
const apiService = {
  // Fetch all families
  async getFamilies() {
    try {
      const response = await fetch(`${API_BASE_URL}/registration/families`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching families:', error);
      throw error;
    }
  },

  // Update family status
  async updateFamilyStatus(familyId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/registration/families/${familyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating family status:', error);
      throw error;
    }
  },

  // Delete family
  async deleteFamily(familyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/registration/families/${familyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting family:', error);
      throw error;
    }
  },
};

// Mock data for announcements (temporary until you have announcements API)
const mockAnnouncements = [
  {
    id: 1,
    message: "Community meeting this Saturday at 5 PM",
    state: "Maharashtra",
    city: "Mumbai",
    timestamp: new Date().toISOString(),
  }
];

// Mock Indian states and cities
const indianStates = {
  "Uttar Pradesh": ["Moradabad", "Lucknow", "Kanpur", "Varanasi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Delhi": ["Delhi"],
  "Karnataka": ["Bangalore", "Mysore"],
  "Gujarat": ["Ahmedabad", "Surat"],
};

// Icons
const BirthdayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 5a3 3 0 015.252-2.121l.738.737a.5.5 0 00.708 0l.737-.737A3 3 0 1115 5v2.25a.75.75 0 01-1.5 0V5a1.5 1.5 0 10-3 0v.098a1.5 1.5 0 00-2.863.064V5a1.5 1.5 0 00-3 0V7.5a.75.75 0 01-1.5 0V5z" clipRule="evenodd" />
    <path d="M2.5 9.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H3.25a.75.75 0 01-.75-.75zM15 11.25a.75.75 0 01.75.75v3.056l-1.5 1.5v-4.556a.75.75 0 01.75-.75zM5 11.25a.75.75 0 01.75.75v4.556l-1.5-1.5V12a.75.75 0 01.75-.75zM9.25 11.25a.75.75 0 01.75.75v4.556l-1.5-1.5V12a.75.75 0 01.75-.75h1.5z" />
  </svg>
);

const AnniversaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
};

// Action Buttons Component
const ActionButtons = ({ family, onUpdateStatus, onDelete, isLoading }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleApprove = () => {
    onUpdateStatus(family.id, 'approved');
  };

  const handleReject = () => {
    onUpdateStatus(family.id, 'rejected');
  };

  const handleDelete = () => {
    onDelete(family.id);
    setIsAlertOpen(false);
  };

  return (
    <>
      <div className="flex space-x-2 justify-end">
        {family.status === 'pending' && (
          <>
            <Button size="sm" variant="outline" onClick={handleApprove} disabled={isLoading}>
              Approve
            </Button>
            <Button size="sm" variant="secondary" onClick={handleReject} disabled={isLoading}>
              Reject
            </Button>
          </>
        )}
        <Button size="sm" variant="link" className="text-gray-500" onClick={() => alert(`Send message to ${family.head_name}`)}>
          Message
        </Button>
        <Button size="sm" variant="danger" onClick={() => setIsAlertOpen(true)} disabled={isLoading}>
          Delete
        </Button>
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        title="Delete Family Record"
        confirmText="Delete"
      >
        Are you sure you want to delete the entire record for the family of {family.head_name}? This action cannot be undone.
      </AlertDialog>
    </>
  );
};

// Family Table Component
const FamilyTable = ({ families, updateStatus, deleteFamily, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (families.length === 0) {
    return <p className="text-center py-8 text-gray-500">No families found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {families.map(family => (
            <tr key={family.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{family.head_name}</div>
                <div className="text-sm text-gray-500">{family.occupation}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{family.head_mobile}</div>
                <div className="text-sm text-gray-500">{family.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {family.flat_no && family.block ? `${family.flat_no}, ${family.block}` : 'N/A'}
                <div className="text-xs text-gray-400">{family.city}, {family.state}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {family.member_count || 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={family.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ActionButtons 
                  family={family} 
                  onUpdateStatus={updateStatus} 
                  onDelete={deleteFamily}
                  isLoading={isLoading}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Reports Table Component
const ReportsTable = ({ families = [], eventType = "all" }) => {
  // Transform families data to match reports format
  const members = families.flatMap(family => 
    Array.from({ length: family.member_count || 1 }, (_, index) => ({
      id: `${family.id}-${index}`,
      name: index === 0 ? family.head_name : `Family Member ${index + 1}`,
      dob: "1990-01-01", // You'll need to add this to your API
      doa: family.created_at,
      marital_status: "Unknown", // You'll need to add this to your API
      family_head_name: family.head_name,
      family_head_mobile: family.head_mobile,
      city: family.city,
      state: family.state,
    }))
  );

  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  if (members.length === 0) {
    return <p className="text-center py-8 text-gray-500">No members match the current filters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Name</th>
            {eventType !== "all" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {eventType === "birthdays" ? "Birthday" : "Anniversary"}
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marital Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family Head</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
              {eventType !== "all" && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                  {formatDate(eventType === "birthdays" ? member.dob : member.doa)}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAge(member.dob)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.marital_status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{member.family_head_name}</div>
                <div className="text-sm text-gray-500">{member.family_head_mobile}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.city}, {member.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Upcoming Events Component
const UpcomingEvents = () => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Mock events for now - you can replace with actual data from your API
  const events = [
    {
      type: 'Birthday',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      memberName: 'Ajay Saini',
      familyHeadName: 'Ajay Saini',
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events (Next 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <ul className="space-y-3">
            {events.map((event, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">
                  {event.type === 'Birthday' ? <BirthdayIcon /> : <AnniversaryIcon />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {event.memberName}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      ({event.type})
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(event.date)} - Family of {event.familyHeadName}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center text-gray-500 py-4">
            No upcoming events in the next 30 days.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Announcements Component
const Announcements = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [newMessage, setNewMessage] = useState('');
  const [targetState, setTargetState] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      // Mock implementation for now
      setTimeout(() => {
        const newAnn = {
          id: announcements.length + 1,
          message: newMessage.trim(),
          state: targetState,
          city: targetCity,
          timestamp: new Date().toISOString(),
        };
        setAnnouncements([newAnn, ...announcements]);
        setNewMessage('');
        setTargetState('');
        setTargetCity('');
        setIsSending(false);
      }, 800);
    } catch (error) {
      console.error('Error sending announcement:', error);
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTargetScope = (ann) => {
    if (ann.state && ann.city) return `${ann.city}, ${ann.state}`;
    if (ann.state) return `${ann.state} (All Cities)`;
    return 'Global';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Society Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            placeholder="Type your announcement here..."
            disabled={isSending}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="targetState" className="block text-xs font-medium text-gray-600 mb-1">
                Target State
              </label>
              <select
                id="targetState"
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                disabled={isSending}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All States (Global)</option>
                {Object.keys(indianStates).sort().map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="targetCity" className="block text-xs font-medium text-gray-600 mb-1">
                Target City
              </label>
              <select
                id="targetCity"
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                disabled={!targetState || isSending}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"
              >
                <option value="">All Cities in State</option>
                {targetState &&
                  indianStates[targetState]?.sort().map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
              </select>
            </div>
          </div>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            isLoading={isSending}
          >
            Send Announcement
          </Button>
        </form>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Announcements</h4>
          {announcements.length === 0 ? (
            <p className="text-sm text-center text-gray-500 py-4">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <li key={ann.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-800">{ann.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
                      For: {getTargetScope(ann)}
                    </span>
                    <p className="text-right text-xs text-gray-400">{formatTimestamp(ann.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main SuperAdminDashboard Component
export default function SuperAdminDashboard() {
  const [families, setFamilies] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch families data from API
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/registration/families`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFamilies(data.families);
        } else {
          throw new Error('Failed to fetch families');
        }
      } catch (err) {
        console.error('Error fetching families:', err);
        setError('Failed to load families data. Please check if the server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  const updateFamilyStatus = async (familyId, newStatus) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/registration/families/${familyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFamilies(prev =>
          prev.map(f => (f.id === familyId ? { ...f, status: newStatus } : f))
        );
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating family status:', err);
      alert('Failed to update family status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFamily = async (familyId) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/registration/families/${familyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFamilies(prev => prev.filter(f => f.id !== familyId));
      } else {
        throw new Error('Failed to delete family');
      }
    } catch (err) {
      console.error('Error deleting family:', err);
      alert('Failed to delete family. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage announcements, families, and view reports</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {['overview', 'announcements', 'families', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <Spinner />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{families.length}</p>
                          <p className="text-sm text-gray-600">Total Families</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {families.filter(f => f.status === 'approved').length}
                          </p>
                          <p className="text-sm text-gray-600">Approved</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">
                            {families.filter(f => f.status === 'pending').length}
                          </p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">
                            {families.filter(f => f.status === 'rejected').length}
                          </p>
                          <p className="text-sm text-gray-600">Rejected</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Families</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <Spinner />
                      </div>
                    ) : families.length === 0 ? (
                      <p className="text-center py-4 text-gray-500">No families found.</p>
                    ) : (
                      <div className="space-y-3">
                        {families.slice(0, 3).map((family) => (
                          <div key={family.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                            <p className="text-sm font-medium text-gray-800">{family.head_name}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
                                {family.flat_no}, {family.block}
                              </span>
                              <StatusBadge status={family.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <UpcomingEvents />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-center" 
                      onClick={() => setActiveTab('announcements')}
                    >
                      Send Announcement
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center"
                      onClick={() => setActiveTab('families')}
                    >
                      Manage Families
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full justify-center"
                      onClick={() => setActiveTab('reports')}
                    >
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Announcements />
              </div>
              <div>
                <UpcomingEvents />
              </div>
            </div>
          )}

          {activeTab === 'families' && (
            <Card>
              <CardHeader>
                <CardTitle>Family Management</CardTitle>
              </CardHeader>
              <CardContent>
                <FamilyTable 
                  families={families} 
                  updateStatus={updateFamilyStatus} 
                  deleteFamily={deleteFamily}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReportsTable families={families} />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Birthday Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReportsTable families={families} eventType="birthdays" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Anniversary Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReportsTable families={families} eventType="anniversaries" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}