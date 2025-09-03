import { useAtom, useAtomValue } from 'jotai';
import React from 'react';

import { useSocketEvents } from '../hooks/socket';
import { currentRoomIdAtom, roomsAtomFamily } from '../store';
import Button from './Button';
import ParticipantsPanel from './ParticipantsPanel';
import RoomCanvas from './RoomCanvas';

const RoomView: React.FC = () => {
  const [currentRoomId] = useAtom(currentRoomIdAtom);
  const currentRoom = useAtomValue(roomsAtomFamily(currentRoomId));
  const { leaveRoom } = useSocketEvents();

  const handleLeaveRoom = () => {
    if (currentRoomId) {
      leaveRoom(currentRoomId);
    }
  };

  if (!currentRoom) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Room Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentRoom.name}</h1>
              <p className="text-sm text-gray-600">
                {currentRoom?.isPrivate ? 'Private Room' : 'Public Room'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {currentRoom.isPrivate && (
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleLeaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>

      {/* Room Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 p-4">
          <RoomCanvas />
        </div>

        {/* Participants Panel */}
        <div className="w-80 p-4 border-l border-gray-200 bg-gray-50">
          <ParticipantsPanel />
        </div>
      </div>
    </div>
  );
};

export default RoomView;
