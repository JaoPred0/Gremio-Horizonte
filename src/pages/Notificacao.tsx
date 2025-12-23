import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Bell, X, MessageCircle, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  uid: string;
  type?: 'comment' | 'like' | 'system';
  postId?: string;
  commentText?: string;
  authorName?: string;
}

// Funções do Firebase
const getNotifications = async (uid: string) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    
    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return [];
  }
};

const deleteNotification = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'notifications', id));
    return true;
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    return false;
  }
};

const deleteOldNotifications = async (uid: string) => {
  try {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, 'notifications'),
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(q);
    
    const oldDocs = snapshot.docs.filter(doc => {
      const data = doc.data();
      return data.createdAt < oneWeekAgo;
    });
    
    const deletePromises = oldDocs.map(document => 
      deleteDoc(doc(db, 'notifications', document.id))
    );
    
    await Promise.all(deletePromises);
    return oldDocs.length;
  } catch (error) {
    console.error('Erro ao deletar notificações antigas:', error);
    return 0;
  }
};

const markAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
  } catch (error) {
    console.error('Erro ao marcar como lida:', error);
  }
};

const NotificationItem = ({ 
  notification, 
  onDelete,
  onNavigate 
}: { 
  notification: Notification; 
  onDelete: (id: string) => void;
  onNavigate: (notification: Notification) => void;
}) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-150, 0, 150],
    ['rgb(239, 68, 68)', 'transparent', 'rgb(239, 68, 68)']
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onDelete(notification.id);
    } else {
      x.set(0);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageCircle className="w-5 h-5" />;
      case 'like':
        return <Heart className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getIconBg = () => {
    switch (notification.type) {
      case 'comment':
        return 'bg-blue-500';
      case 'like':
        return 'bg-pink-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{ x }}
      drag={isMobile ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={0.2}
      className="relative"
    >
      {/* Fundo de deletar ao arrastar */}
      {isMobile && (
        <motion.div 
          style={{ background }}
          className="absolute inset-0 rounded-2xl flex items-center justify-between px-6"
        >
          <Trash2 className="w-6 h-6 text-white" />
          <Trash2 className="w-6 h-6 text-white" />
        </motion.div>
      )}

      {/* Card da notificação */}
      <motion.div
        onClick={() => onNavigate(notification)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative bg-base-100 rounded-2xl p-4 shadow-md cursor-pointer border-l-4 ${
          notification.read 
            ? 'border-base-300 opacity-70' 
            : notification.type === 'comment' 
              ? 'border-blue-500' 
              : notification.type === 'like'
                ? 'border-pink-500'
                : 'border-purple-500'
        } hover:shadow-lg transition-all`}
      >
        <div className="flex gap-4">
          {/* Ícone */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getIconBg()} flex items-center justify-center text-white shadow-lg`}>
            {getIcon()}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-base leading-tight">
                  {notification.authorName}
                </h3>
                <p className="text-sm opacity-70 mt-0.5">
                  {notification.message}
                </p>
              </div>
              
              {!isMobile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Texto do comentário */}
            {notification.commentText && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-base-200 rounded-xl text-sm"
              >
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-50" />
                  <p className="flex-1 italic line-clamp-2">"{notification.commentText}"</p>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs opacity-50 flex items-center gap-1">
                <span>•</span>
                {formatDate(notification.createdAt)}
              </span>
              
              {notification.postId && (
                <span className="text-xs text-primary flex items-center gap-1 font-medium">
                  Ver post
                  <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badge de não lida */}
        {!notification.read && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export const Notificacao = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
        setNotifications([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const initNotifications = async () => {
      await deleteOldNotifications(currentUser);
      await loadNotifications();
    };

    initNotifications();

    const interval = setInterval(async () => {
      await deleteOldNotifications(currentUser);
      await loadNotifications();
    }, 3600000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const loadNotifications = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const notifs = await getNotifications(currentUser);
    setNotifications(notifs);
    setLoading(false);
  };

  const handleNavigate = async (notification: Notification) => {
    await markAsRead(notification.id);
    
    if (notification.postId) {
      navigate('/apps/xhorizonte', { state: { scrollToPost: notification.postId } });
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleClearAll = async () => {
    const deletePromises = notifications.map(n => deleteNotification(n.id));
    await Promise.all(deletePromises);
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-base-100 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <Bell className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Faça login</h2>
          <p className="opacity-60">Entre para ver suas notificações</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Notificações</h1>
                <p className="text-sm opacity-60">
                  {notifications.length > 0 
                    ? `${notifications.length} ${notifications.length === 1 ? 'notificação' : 'notificações'}`
                    : 'Nenhuma notificação'
                  }
                  {unreadCount > 0 && (
                    <span className="ml-2 text-primary font-semibold">
                      • {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="btn btn-error btn-sm gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Alert mobile */}
        {isMobile && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert bg-info/10 border-info/20 mb-4"
          >
            <div className="flex items-center gap-2 text-sm">
              <span>💡</span>
              <span>Deslize para deletar</span>
            </div>
          </motion.div>
        )}

        {/* Lista de notificações */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 opacity-60">Carregando...</p>
            </div>
          ) : notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-base-100 rounded-3xl shadow-lg p-12 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
              >
                <Bell className="w-10 h-10 opacity-30" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Tudo limpo!</h3>
              <p className="opacity-60">
                Você não tem notificações no momento
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDelete}
                  onNavigate={handleNavigate}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 opacity-40 text-xs"
          >
            <p>Notificações antigas são removidas automaticamente após 7 dias</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};