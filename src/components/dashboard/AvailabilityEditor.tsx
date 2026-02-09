'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Save,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Video,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type SessionMedium = 'IN_PERSON' | 'VIDEO' | 'GROUP';

interface WeeklySlot {
  dayOfWeek: number;
  startTime: string;
  medium: SessionMedium;
}

interface DateOverride {
  id?: string;
  date: string;
  startTime: string;
  medium: SessionMedium;
  isAvailable: boolean;
}

interface AvailabilityEditorProps {
  tutorId: string;
  onSave?: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MEDIA_TABS: { id: SessionMedium; label: string; icon: typeof Video }[] = [
  { id: 'VIDEO', label: '1:1 Video', icon: Video },
  { id: 'IN_PERSON', label: 'In-Person', icon: MapPin },
  { id: 'GROUP', label: 'Group Video', icon: Users },
];

// Generate time slots from 08:00 to 21:30
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour < 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export function AvailabilityEditor({ tutorId, onSave }: AvailabilityEditorProps) {
  const [selectedMedium, setSelectedMedium] = useState<SessionMedium>('VIDEO');
  const [weeklySlots, setWeeklySlots] = useState<Map<string, Set<SessionMedium>>>(new Map());
  const [originalSlots, setOriginalSlots] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Group settings
  const [maxGroupSize, setMaxGroupSize] = useState(5);
  const [groupHourlyRate, setGroupHourlyRate] = useState<string>('');
  const [groupSettingsChanged, setGroupSettingsChanged] = useState(false);

  // Date override state
  const [overrideDate, setOverrideDate] = useState<string>('');
  const [overrides, setOverrides] = useState<DateOverride[]>([]);

  // Dragging state for multi-select
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove'>('add');

  const hasUnsavedChanges = JSON.stringify(Array.from(weeklySlots.entries()).map(([k, v]) => [k, Array.from(v)])) !== originalSlots;

  // Fetch weekly slots on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        // Fetch weekly template
        const response = await fetch(`${apiUrl}/api/availability/${tutorId}/weekly`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();

        if (data.success) {
          const newMap = new Map<string, Set<SessionMedium>>();
          for (const slot of data.data.slots) {
            const key = `${slot.dayOfWeek}|${slot.startTime}`;
            if (!newMap.has(key)) newMap.set(key, new Set());
            newMap.get(key)!.add(slot.medium);
          }
          setWeeklySlots(newMap);
          setOriginalSlots(JSON.stringify(Array.from(newMap.entries()).map(([k, v]) => [k, Array.from(v)])));
        }

        // Fetch tutor profile for group settings
        const tutorRes = await fetch(`${apiUrl}/api/tutors/${tutorId}`);
        const tutorData = await tutorRes.json();
        if (tutorData.success || tutorData.data) {
          const tutor = tutorData.data || tutorData;
          setMaxGroupSize(tutor.maxGroupSize || 5);
          setGroupHourlyRate(tutor.groupHourlyRate ? String(tutor.groupHourlyRate) : '');
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [tutorId]);

  // Toggle a single slot
  const toggleSlot = useCallback((dayOfWeek: number, startTime: string) => {
    setWeeklySlots(prev => {
      const newMap = new Map(prev);
      const key = `${dayOfWeek}|${startTime}`;
      const mediums = newMap.get(key) || new Set();

      if (mediums.has(selectedMedium)) {
        mediums.delete(selectedMedium);
        if (mediums.size === 0) newMap.delete(key);
        else newMap.set(key, new Set(mediums));
      } else {
        const newSet = new Set(mediums);
        newSet.add(selectedMedium);
        newMap.set(key, newSet);
      }

      return newMap;
    });
  }, [selectedMedium]);

  // Handle drag toggle
  const handleMouseDown = (dayOfWeek: number, startTime: string) => {
    const key = `${dayOfWeek}|${startTime}`;
    const mediums = weeklySlots.get(key);
    const isCurrentlyActive = mediums?.has(selectedMedium) || false;

    setIsDragging(true);
    setDragAction(isCurrentlyActive ? 'remove' : 'add');
    toggleSlot(dayOfWeek, startTime);
  };

  const handleMouseEnter = (dayOfWeek: number, startTime: string) => {
    if (!isDragging) return;

    setWeeklySlots(prev => {
      const newMap = new Map(prev);
      const key = `${dayOfWeek}|${startTime}`;
      const mediums = newMap.get(key) || new Set();

      if (dragAction === 'add') {
        const newSet = new Set(mediums);
        newSet.add(selectedMedium);
        newMap.set(key, newSet);
      } else {
        mediums.delete(selectedMedium);
        if (mediums.size === 0) newMap.delete(key);
        else newMap.set(key, new Set(mediums));
      }

      return newMap;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Check if a slot is active for the current medium
  const isSlotActive = (dayOfWeek: number, startTime: string): boolean => {
    const key = `${dayOfWeek}|${startTime}`;
    return weeklySlots.get(key)?.has(selectedMedium) || false;
  };

  // Quick actions
  const selectAllForDay = (dayOfWeek: number) => {
    setWeeklySlots(prev => {
      const newMap = new Map(prev);
      for (const time of TIME_SLOTS) {
        const key = `${dayOfWeek}|${time}`;
        const mediums = newMap.get(key) || new Set();
        const newSet = new Set(mediums);
        newSet.add(selectedMedium);
        newMap.set(key, newSet);
      }
      return newMap;
    });
  };

  const clearAllForDay = (dayOfWeek: number) => {
    setWeeklySlots(prev => {
      const newMap = new Map(prev);
      for (const time of TIME_SLOTS) {
        const key = `${dayOfWeek}|${time}`;
        const mediums = newMap.get(key);
        if (mediums) {
          mediums.delete(selectedMedium);
          if (mediums.size === 0) newMap.delete(key);
          else newMap.set(key, new Set(mediums));
        }
      }
      return newMap;
    });
  };

  const copyMondayToWeekdays = () => {
    setWeeklySlots(prev => {
      const newMap = new Map(prev);
      // Get Monday (1) slots for current medium
      const mondaySlots = TIME_SLOTS.filter(time => {
        const key = `1|${time}`;
        return newMap.get(key)?.has(selectedMedium) || false;
      });

      // Apply to Tue(2)-Fri(5)
      for (let day = 2; day <= 5; day++) {
        // Clear existing
        for (const time of TIME_SLOTS) {
          const key = `${day}|${time}`;
          const mediums = newMap.get(key);
          if (mediums) {
            mediums.delete(selectedMedium);
            if (mediums.size === 0) newMap.delete(key);
            else newMap.set(key, new Set(mediums));
          }
        }
        // Apply Monday's slots
        for (const time of mondaySlots) {
          const key = `${day}|${time}`;
          const mediums = newMap.get(key) || new Set();
          const newSet = new Set(mediums);
          newSet.add(selectedMedium);
          newMap.set(key, newSet);
        }
      }
      return newMap;
    });
  };

  // Save weekly template
  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Convert map to array of slots
      const slots: WeeklySlot[] = [];
      for (const [key, mediums] of weeklySlots.entries()) {
        const [dayStr, startTime] = key.split('|');
        const dayOfWeek = parseInt(dayStr);
        for (const medium of mediums) {
          slots.push({ dayOfWeek, startTime, medium });
        }
      }

      const response = await fetch(`${apiUrl}/api/availability/weekly`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slots }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      // Save group settings if changed
      if (groupSettingsChanged) {
        await fetch(`${apiUrl}/api/tutors/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            maxGroupSize,
            groupHourlyRate: groupHourlyRate ? parseFloat(groupHourlyRate) : null,
          }),
        });
        setGroupSettingsChanged(false);
      }

      setOriginalSlots(JSON.stringify(Array.from(weeklySlots.entries()).map(([k, v]) => [k, Array.from(v)])));
      setSaveMessage({ type: 'success', text: 'Availability saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
      onSave?.();
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save availability' });
    } finally {
      setSaving(false);
    }
  };

  // Count active slots for a medium
  const countSlotsForMedium = (medium: SessionMedium): number => {
    let count = 0;
    for (const mediums of weeklySlots.values()) {
      if (mediums.has(medium)) count++;
    }
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D9B6E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E50]">Weekly Availability</h2>
          <p className="text-sm text-[#5D6D7E] mt-1">
            Set when you're available for each session type. Click or drag to toggle slots.
          </p>
        </div>
        <Button
          onClick={handleSave}
          isLoading={saving}
          disabled={!hasUnsavedChanges && !groupSettingsChanged}
          className="min-w-[140px]"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
          saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* Unsaved changes indicator */}
      {(hasUnsavedChanges || groupSettingsChanged) && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2 text-sm text-amber-700">
          <AlertCircle className="w-4 h-4" />
          You have unsaved changes
        </div>
      )}

      {/* Medium Tabs */}
      <div className="flex gap-2 bg-[#F8F9FA] p-1 rounded-lg">
        {MEDIA_TABS.map((tab) => {
          const Icon = tab.icon;
          const count = countSlotsForMedium(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedMedium(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                selectedMedium === tab.id
                  ? 'bg-white text-[#2D9B6E] shadow-sm'
                  : 'text-[#5D6D7E] hover:text-[#2C3E50]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedMedium === tab.id ? 'bg-[#2D9B6E]/10 text-[#2D9B6E]' : 'bg-[#ECF0F1] text-[#5D6D7E]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* In-Person travel time hint */}
      {selectedMedium === 'IN_PERSON' && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2 text-sm text-blue-700">
          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Leave gaps between in-person availability slots for travel time!</span>
        </div>
      )}

      {/* Group Settings (only visible for GROUP medium) */}
      {selectedMedium === 'GROUP' && (
        <div className="bg-white border border-[#ECF0F1] rounded-xl p-4">
          <h3 className="font-semibold text-[#2C3E50] mb-3">Group Session Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#5D6D7E] mb-1">Max Group Size</label>
              <input
                type="number"
                min={2}
                max={20}
                value={maxGroupSize}
                onChange={(e) => {
                  setMaxGroupSize(parseInt(e.target.value) || 5);
                  setGroupSettingsChanged(true);
                }}
                className="w-full px-3 py-2 border border-[#ECF0F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#5D6D7E] mb-1">Group Rate (per student/hr)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[#5D6D7E]">€</span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={groupHourlyRate}
                  onChange={(e) => {
                    setGroupHourlyRate(e.target.value);
                    setGroupSettingsChanged(true);
                  }}
                  placeholder="Same as 1:1 rate"
                  className="w-full pl-7 pr-3 py-2 border border-[#ECF0F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D9B6E]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#5D6D7E]">Quick:</span>
        <button
          onClick={copyMondayToWeekdays}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#F0F7F4] text-[#2D9B6E] rounded-lg hover:bg-[#2D9B6E]/20 transition-colors"
        >
          <Copy className="w-3 h-3" />
          Copy Mon → Weekdays
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white border border-[#ECF0F1] rounded-xl overflow-hidden select-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA]">
                <th className="w-16 px-2 py-2 text-xs text-[#5D6D7E] font-medium text-left sticky left-0 bg-[#F8F9FA]">
                  Time
                </th>
                {DAYS.map((day, i) => (
                  <th key={day} className="px-1 py-2 text-center min-w-[80px]">
                    <span className="text-xs font-medium text-[#2C3E50]">{day}</span>
                    <div className="flex justify-center gap-1 mt-1">
                      <button
                        onClick={() => selectAllForDay(i)}
                        className="text-[10px] px-1.5 py-0.5 bg-[#2D9B6E]/10 text-[#2D9B6E] rounded hover:bg-[#2D9B6E]/20"
                        title="Select all"
                      >
                        All
                      </button>
                      <button
                        onClick={() => clearAllForDay(i)}
                        className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                        title="Clear all"
                      >
                        Clear
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-t border-[#F8F9FA]">
                  <td className="px-2 py-0 text-xs text-[#95A5A6] font-mono sticky left-0 bg-white">
                    {time}
                  </td>
                  {DAYS.map((_, dayIdx) => {
                    const active = isSlotActive(dayIdx, time);
                    return (
                      <td key={dayIdx} className="px-0.5 py-0.5">
                        <button
                          onMouseDown={() => handleMouseDown(dayIdx, time)}
                          onMouseEnter={() => handleMouseEnter(dayIdx, time)}
                          className={`w-full h-6 rounded transition-colors ${
                            active
                              ? 'bg-[#2D9B6E] hover:bg-[#258c5f]'
                              : 'bg-[#F8F9FA] hover:bg-[#ECF0F1]'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-[#5D6D7E]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#2D9B6E]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#F8F9FA] border border-[#ECF0F1]" />
          <span>Unavailable</span>
        </div>
        <span className="text-[#95A5A6]">Click or drag to toggle slots</span>
      </div>
    </div>
  );
}
