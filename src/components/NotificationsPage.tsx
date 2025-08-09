import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Clock,
  ArrowLeft,
  Settings,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'error',
    title: 'Đã xảy ra lỗi',
    message: 'Bạn đã nhập sai thông tin đăng nhập. Vui lòng kiểm tra lại email và mật khẩu.',
    timestamp: '2 phút trước',
    isRead: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Thành công',
    message: 'Dữ liệu dinh dưỡng của bạn đã được cập nhật thành công. Kế hoạch ăn uống mới đã sẵn sàng.',
    timestamp: '15 phút trước',
    isRead: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Cảnh báo',
    message: 'Lượng calo hôm nay của bạn đã vượt quá mức khuyến nghị. Hãy cân nhắc giảm bớt trong bữa tối.',
    timestamp: '1 giờ trước',
    isRead: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Đã xảy ra lỗi',
    message: 'Không thể tải lên hình ảnh. Vui lòng kiểm tra kết nối mạng và thử lại.',
    timestamp: '2 giờ trước',
    isRead: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Thông tin',
    message: 'Bạn có một tính năng mới: AI Chat để tư vấn dinh dưỡng cá nhân hóa. Hãy thử ngay!',
    timestamp: '1 ngày trước',
    isRead: true
  },
  {
    id: '6',
    type: 'success',
    title: 'Hoàn thành mục tiêu',
    message: 'Chúc mừng! Bạn đã hoàn thành mục tiêu dinh dưỡng tuần này với 100% protein và vitamin.',
    timestamp: '2 ngày trước',
    isRead: true
  },
  {
    id: '7',
    type: 'error',
    title: 'Đã xảy ra lỗi',
    message: 'Phiên đăng nhập đã hết hạn. Bạn cần đăng nhập lại để tiếp tục sử dụng ứng dụng.',
    timestamp: '3 ngày trước',
    isRead: true
  },
  {
    id: '8',
    type: 'warning',
    title: 'Cảnh báo sức khỏe',
    message: 'Bạn đã không ghi nhận bữa ăn nào trong 2 ngày. Hãy cập nhật để theo dõi dinh dưỡng tốt hơn.',
    timestamp: '5 ngày trước',
    isRead: true
  },
  {
    id: '9',
    type: 'info',
    title: 'Nhắc nhở',
    message: 'Đã đến giờ uống nước! Bạn cần uống thêm 500ml nước để đạt mục tiêu hàng ngày.',
    timestamp: '1 tuần trước',
    isRead: true
  },
  {
    id: '10',
    type: 'success',
    title: 'Cập nhật thành công',
    message: 'Hồ sơ sức khỏe của bạn đã được đồng bộ thành công với thiết bị đeo tay.',
    timestamp: '1 tuần trước',
    isRead: true
  }
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notificationpages, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'error' | 'warning' | 'info'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationStyles = (type: string, isRead: boolean) => {
    const baseClasses = "relative p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] transform cursor-pointer";
    const opacity = isRead ? "opacity-70" : "opacity-100";
    
    switch (type) {
      case 'success':
        return `${baseClasses} ${opacity} bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/60 hover:from-green-100 hover:to-emerald-100 hover:border-green-300/80`;
      case 'error':
        return `${baseClasses} ${opacity} bg-gradient-to-r from-red-50 to-pink-50 border-red-200/60 hover:from-red-100 hover:to-pink-100 hover:border-red-300/80`;
      case 'warning':
        return `${baseClasses} ${opacity} bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/60 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300/80`;
      case 'info':
        return `${baseClasses} ${opacity} bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/60 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300/80`;
      default:
        return `${baseClasses} ${opacity} bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200/60 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300/80`;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getGlowEffect = (type: string) => {
    switch (type) {
      case 'success':
        return 'absolute -inset-1 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse';
      case 'error':
        return 'absolute -inset-1 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse';
      case 'warning':
        return 'absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse';
      case 'info':
        return 'absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse';
      default:
        return 'absolute -inset-1 bg-gradient-to-r from-gray-400/20 to-slate-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse';
    }
  };

  const markAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notificationpages.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    return notif.type === filter;
  });

  const unreadCount = notificationpages.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-indigo-50/50 pt-5">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 group mb-6"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-2xl blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-xl">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Thông báo
                </h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã xem hết thông báo!'}
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-blue-100/50">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'unread', label: 'Chưa đọc' },
                  { key: 'success', label: 'Thành công' },
                  { key: 'error', label: 'Lỗi' },
                  { key: 'warning', label: 'Cảnh báo' },
                  { key: 'info', label: 'Thông tin' }
                ].map((filterType) => (
                  <button
                    key={filterType.key}
                    onClick={() => setFilter(filterType.key as any)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 capitalize ${
                      filter === filterType.key
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    {filterType.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/20 to-slate-400/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-gray-100 p-8 rounded-2xl">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mt-4">No notifications found</h3>
            <p className="text-gray-500">All clear! No notifications match your current filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="group relative">
                <div className={getGlowEffect(notification.type)}></div>
                <div className={getNotificationStyles(notification.type, notification.isRead)}>
                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-3 rounded-xl ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-amber-100' :
                      'bg-blue-100'
                    }`}>
                      <div className={getIconColor(notification.type)}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => markAsRead(notification.id, e)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:bg-blue-50 rounded-lg"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors duration-300 hover:bg-red-50 rounded-lg"
                            title="Delete notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}