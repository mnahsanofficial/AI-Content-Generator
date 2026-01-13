import { useEffect, useRef } from 'react';
import { getSocket, subscribeToContentReady, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/lib/store';

export const useSocket = () => {
  const { user } = useAuthStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user]);

  const subscribeToContent = (
    callback: (data: { jobId: string; content: any }) => void
  ) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return () => {};
    }

    const unsubscribe = subscribeToContentReady(user.id, callback);
    unsubscribeRef.current = unsubscribe;
    return unsubscribe;
  };

  return { subscribeToContent };
};

