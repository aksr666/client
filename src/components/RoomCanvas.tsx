import React, { useEffect, useRef, useCallback } from 'react'
import { useAtom } from 'jotai'
import { currentRoomAtom, cursorsAtom } from '../store'
import { useSocketEvents } from '../features/socket'

const RoomCanvas: React.FC = () => {
  const [currentRoom] = useAtom(currentRoomAtom)
  const [cursors, setCursors] = useAtom(cursorsAtom)
  const { moveCursor, leaveCursor } = useSocketEvents()
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const lastEmitRef = useRef<{ x: number; y: number; timestamp: number } | null>(null)

  // Throttle cursor emissions to ~20-30Hz
  const emitCursorMove = useCallback((x: number, y: number) => {
    if (!currentRoom) return

    const now = Date.now()
    const lastEmit = lastEmitRef.current
    const timeSinceLastEmit = lastEmit ? now - lastEmit.timestamp : Infinity

    // Only emit if position changed and enough time has passed (~33ms = 30fps)
    if (!lastEmit || 
        Math.abs(x - lastEmit.x) > 2 || 
        Math.abs(y - lastEmit.y) > 2 || 
        timeSinceLastEmit > 33) {
      
      moveCursor({ x, y, roomId: currentRoom.id })
      lastEmitRef.current = { x, y, timestamp: now }
    }
  }, [currentRoom, moveCursor])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    emitCursorMove(x, y)
  }, [emitCursorMove])

  const handleMouseLeave = useCallback(() => {
    if (currentRoom) {
      leaveCursor(currentRoom.id)
    }
  }, [currentRoom, leaveCursor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentRoom) return

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [currentRoom, handleMouseMove, handleMouseLeave])

  // Cleanup cursors older than 5 seconds
  useEffect(() => {
    const cleanupExpiredCursors = () => {
      const now = Date.now()
      const expiredCursors = Object.entries(cursors).filter(
        ([_, cursor]) => now - cursor.lastSeen > 5000
      )
      
      if (expiredCursors.length > 0) {
        expiredCursors.forEach(([userId]) => {
          // Remove expired cursor from state
          setCursors((prev) => {
            const newCursors = { ...prev }
            delete newCursors[userId]
            return newCursors
          })
        })
      }
    }

    const interval = setInterval(cleanupExpiredCursors, 1000)
    return () => clearInterval(interval)
  }, [cursors, setCursors])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentRoom) {
        leaveCursor(currentRoom.id)
      }
    }
  }, [currentRoom, leaveCursor])

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full bg-gray-50 rounded-2xl overflow-hidden cursor-crosshair"
    >
      {/* Remote cursors */}
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute pointer-events-none transition-all duration-150 ease-out"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Cursor dot */}
          <div 
            className="w-3 h-3 rounded-full shadow-lg border-2 border-white"
            style={{
              backgroundColor: `hsl(${(parseInt(userId) * 137.5) % 360}, 70%, 60%)`
            }}
          />
          {/* Username badge */}
          <div className="absolute top-4 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {cursor.user.firstName} {cursor.user.lastName}
          </div>
        </div>
      ))}
      
      {/* Canvas content placeholder */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">Collaboration Canvas</p>
          <p className="text-sm">Move your mouse to see real-time cursor sharing</p>
        </div>
      </div>
    </div>
  )
}

export default RoomCanvas
