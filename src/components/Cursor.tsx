import React, { useEffect, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { cursorsAtomFamily } from "../store"

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const Cursor: React.FC<{ userId: number }> = ({ userId }) => {
  const target = useAtomValue(cursorsAtomFamily(userId))
  const [pos, setPos] = useState({ x: 0, y: 0, user: { firstName: "", lastName: "" } })

  const rafRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      if (target) {
        setPos((prev) => ({
          x: lerp(prev.x, target.x, 0.2),
          y: lerp(prev.y, target.y, 0.2),
          user: target.user,
        }))
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target])

  if (!target) return null

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Cursor dot */}
      <div
        className="w-3 h-3 rounded-full shadow-lg border-2 border-white"
        style={{
          backgroundColor: `hsl(${(userId * 137.5) % 360}, 70%, 60%)`,
        }}
      />
      {/* Username badge */}
      <div className="absolute top-4 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {pos.user.firstName} {pos.user.lastName}
      </div>
    </div>
  )
}
