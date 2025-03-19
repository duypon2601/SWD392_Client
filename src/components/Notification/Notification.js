import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUnreadNotifications, markNotificationAsRead } from '../../services/notificationService';
import { setUnreadNotifications, markAsRead } from '../redux/features/notificationSlice'; // Sửa đường dẫn

const Notification = () => {
  const dispatch = useDispatch();
  const unreadNotifications = useSelector((state) => state.notifications.unread);

  const loadNotifications = async () => {
    try {
      const notifications = await fetchUnreadNotifications();
      if (notifications.length > 0) {
        dispatch(setUnreadNotifications(notifications));
        notifications.forEach((notif) => {
          if (!notif.isRead) {
            toast.info(notif.message, {
              onClose: () => {
                markNotificationAsRead(notif.id);
                dispatch(markAsRead(notif.id));
              },
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default Notification;