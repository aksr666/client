import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { roomsAtom, currentRoomAtom } from '../../store'
import { useSocketEvents } from '../../features/socket'
import Button from '../Button'
import Input from '../Input'
import JoinRoomModal from '../JoinRoomModal'
import PasswordModal from '../PasswordModal'
import Toast from '../Toast'

const Sidebar: React.FC = () => {
  const [rooms] = useAtom(roomsAtom)
  const [currentRoom] = useAtom(currentRoomAtom)
  const { createRoom, joinRoom } = useSocketEvents()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  
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

  const handleJoinRoom = async (roomId: string, password?: string) => {
    setLoading(true)
    try {
      const result = await joinRoom(roomId, password)
      if (result.success) {
        setToast({ message: 'Successfully joined room!', type: 'success' })
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to join room' }
    } finally {
      setLoading(false)
    }
    return { success: true }
  }

  const handleRoomClick = (room: any) => {
    // If room is private, show toast and don't allow joining by click
    if (room.isPrivate) {
      setToast({ 
        message: 'This room is private. Use the Join Room button.', 
        type: 'warning' 
      })
      return
    }

    // If room has password, show password modal
    if (room.hasPassword) {
      setSelectedRoom(room)
      setShowPasswordModal(true)
      return
    }

    // If room is public and has no password, join immediately
    handleJoinRoom(room.id)
  }

  const handlePasswordJoin = async (password: string) => {
    if (!selectedRoom) return { success: false, error: 'No room selected' }
    
    setLoading(true)
    try {
      const result = await joinRoom(selectedRoom.id, password)
      if (result.success) {
        setToast({ message: 'Successfully joined room!', type: 'success' })
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'Failed to join room' }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm"
              variant="secondary"
              onClick={() => setShowJoinModal(true)}
            >
              Join Room
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Create Room'}
            </Button>
          </div>
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
                onClick={() => handleRoomClick(room)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{room.name}</span>
                    {room.isPrivate && (
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {room.hasPassword && !room.isPrivate && (
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Modals */}
      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinRoom}
        loading={loading}
      />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          setSelectedRoom(null)
        }}
        onJoin={handlePasswordJoin}
        roomName={selectedRoom?.name || ''}
        loading={loading}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default Sidebar
