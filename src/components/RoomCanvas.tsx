import React, { useEffect, useRef, useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { currentRoomIdAtom, roomsAtomFamily } from '../store'
import { useSocketEvents } from '../features/socket'
import { Cursor } from './Cursor'

const RoomCanvas: React.FC = () => {
  const [currentRoomId] = useAtom(currentRoomIdAtom);
  const currentRoom = useAtomValue(roomsAtomFamily(currentRoomId));

  const { moveCursor, leaveCursor } = useSocketEvents();

  const canvasRef = useRef<HTMLDivElement>(null)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const lastSentPos = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number>()

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    lastPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      if (lastPos.current && currentRoomId) {
        const { x, y } = lastPos.current
        const prev = lastSentPos.current

        if (!prev || prev.x !== x || prev.y !== y) {
          moveCursor({ x, y, roomId: currentRoomId })
          lastSentPos.current = { x, y }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [currentRoomId, moveCursor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentRoomId) return

    canvas.addEventListener('mousemove', handleMouseMove)
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [currentRoomId, handleMouseMove])

  useEffect(() => {
    return () => {
      leaveCursor(currentRoomId!)
    }
  }, [currentRoomId, leaveCursor])

  if (!currentRoom) return null;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gray-50 rounded-2xl overflow-hidden cursor-crosshair"
    >
      {currentRoom.participants?.map(({ id }) => (
        <Cursor key={id} userId={id} />
      ))}
    </div>
  )
}

export default RoomCanvas
