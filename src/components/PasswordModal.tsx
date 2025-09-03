import React, { useState } from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin: (password: string) => void
  roomName: string
  loading?: boolean
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  roomName,
  loading = false
}) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    onJoin(password.trim())
  }

  const handleClose = () => {
    setPassword('')
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Join ${roomName}`}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-gray-600">
            This room requires a password to join.
          </p>
        </div>

        <Input
          label="Room Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter room password"
          required
          autoFocus
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Join
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PasswordModal
