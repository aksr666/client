import React, { useState } from 'react';

import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './Modal';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string, password?: string) => void;
  loading?: boolean;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    roomId: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.roomId.trim()) {
      setError('Room ID or name is required');
      return;
    }

    onJoin(formData.roomId.trim(), formData.password || undefined);
  };

  const handleClose = () => {
    setFormData({ roomId: '', password: '' });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join Room" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room ID or Name"
          value={formData.roomId}
          onChange={(e) => setFormData((prev) => ({ ...prev, roomId: e.target.value }))}
          placeholder="Enter room ID or name"
          required
        />

        <Input
          label="Password (if required)"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          placeholder="Enter room password"
          helperText="Leave empty if the room has no password"
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
          <Button type="submit" loading={loading} className="flex-1">
            Join Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinRoomModal;
