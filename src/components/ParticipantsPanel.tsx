import { useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';

import { currentRoomIdAtom, roomsAtomFamily } from '../store';

const ParticipantsPanel: React.FC = () => {
  const [currentRoomId] = useAtom(currentRoomIdAtom);
  const currentRoom = useAtomValue(roomsAtomFamily(currentRoomId));
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!currentRoom) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        role="button"
        tabIndex={0}
        aria-expanded={!isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setIsCollapsed((v) => !v);
        }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <h3 className="font-semibold text-gray-900">Participants</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {currentRoom?.participants?.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {!isCollapsed && (
        <div className="border-t border-gray-200 max-h-64 overflow-y-auto">
          {currentRoom?.participants?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No participants yet</p>
            </div>
          ) : (
            <div className="p-2">
              {currentRoom?.participants?.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      backgroundColor: `hsl(${(participant.id * 137.5) % 360}, 70%, 60%)`,
                    }}
                  >
                    {participant.firstName[0]}
                    {participant.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {participant.firstName} {participant.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{participant.email}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParticipantsPanel;
