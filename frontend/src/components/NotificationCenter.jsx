import React, { useState } from 'react'
import { Bell, Check, Info, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const mockNotifications = [
    { id: 1, type: 'info', text: 'У вас новый прием завтра в 10:00', time: '2 мин. назад', read: false },
    { id: 2, type: 'success', text: 'Результаты анализов загружены', time: '1 час назад', read: true },
    { id: 3, type: 'warning', text: 'Пожалуйста, заполните профиль', time: '3 часа назад', read: false },
]

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState(mockNotifications)
    const unreadCount = notifications.filter(n => !n.read).length

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    return (
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-outline" 
                style={{ padding: '8px', cursor: 'pointer', position: 'relative' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{ 
                        position: 'absolute', 
                        top: -4, 
                        right: -4, 
                        background: 'var(--primary)', 
                        color: 'white', 
                        fontSize: 10, 
                        padding: '2px 6px', 
                        borderRadius: 10,
                        border: '2px solid var(--background)'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="glass"
                        style={{ 
                            position: 'absolute', 
                            top: '100%', 
                            right: 0, 
                            marginTop: 12, 
                            width: 320, 
                            borderRadius: 'var(--radius)', 
                            boxShadow: 'var(--card-shadow)',
                            zIndex: 100,
                            padding: '16px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Уведомления</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--primary)', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    Прочитать все
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 20 }}>Нет уведомлений</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} style={{ 
                                        display: 'flex', 
                                        gap: 12, 
                                        padding: 10, 
                                        borderRadius: 8,
                                        background: n.read ? 'transparent' : 'rgba(37, 99, 235, 0.05)',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{ 
                                            width: 32, 
                                            height: 32, 
                                            borderRadius: '50%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            background: n.type === 'success' ? '#d1fae5' : n.type === 'warning' ? '#fee2e2' : '#dbeafe',
                                            color: n.type === 'success' ? '#059669' : n.type === 'warning' ? '#dc2626' : '#2563eb'
                                        }}>
                                            {n.type === 'success' ? <Check size={16} /> : n.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 13, marginBottom: 2, fontWeight: n.read ? 400 : 600 }}>{n.text}</p>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
