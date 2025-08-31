import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { roomsAtom, currentRoomAtom } from '../../store'
import { useSocketEvents } from '../../features/socket'
import Button from '../Button'
import Input from '../Input'

const Sidebar: React.FC = () => {
  const [rooms] = useAtom(roomsAtom)
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom)
  const { createRoom, joinRoom } = useSocketEvents()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    name: '',
    password: '',
    isPrivate: false
  })

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (createFormData.name.trim()) {
      createRoom({
        name: createFormData.name,
        password: createFormData.password || undefined,
        isPrivate: createFormData.isPrivate
      })
      setCreateFormData({ name: '', password: '', isPrivate: false })
      setShowCreateForm(false)
    }
  }

  const handleJoinRoom = (room: any) => {
    if (room.hasPassword) {
      const password = prompt('Enter room password:')
      if (password) {
        joinRoom(room.id, password)
        setCurrentRoom(room)
      }
    } else {
      joinRoom(room.id)
      setCurrentRoom(room)
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
        <Button 
          size="sm" 
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Room'}
        </Button>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateRoom} className="mb-6 p-4 bg-white rounded-2xl shadow-sm border">
          <Input
            label="Room Name"
            value={createFormData.name}
            onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter room name"
            required
            className="mb-3"
          />
          <Input
            label="Password (optional)"
            type="password"
            value={createFormData.password}
            onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter password"
            className="mb-3"
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPrivate"
              checked={createFormData.isPrivate}
              onChange={(e) => setCreateFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
              Private Room
            </label>
          </div>
          <Button type="submit" className="w-full">
            Create Room
          </Button>
        </form>
      )}

      {/* Rooms List */}
      <div className="space-y-2">
        {rooms.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No rooms available</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className={`
                p-3 rounded-2xl cursor-pointer transition-all duration-200
                ${currentRoom?.id === room.id 
                  ? 'bg-blue-100 border border-blue-200' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                }
              `}
              onClick={() => handleJoinRoom(room)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{room.name}</span>
                  {room.isPrivate && (
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {room.userCount !== undefined && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {room.userCount} users
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar
