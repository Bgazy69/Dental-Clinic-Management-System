import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import StatCard from '../../components/StatCard'
import { Calendar, CheckCircle, Users, Clock, RefreshCw, ChevronRight, Phone, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DoctorDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const qc = useQueryClient()

    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['doctor-today', user.doctorId, today],
        queryFn: () => api.get(`/appointments?doctorId=${user.doctorId}&date=${today}`).then(r => r.data),
        enabled: !!user.doctorId,
        refetchInterval: 30000 
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status, notes }) => api.put(`/appointments/${id}`, { status, notes }),
        onSuccess: () => qc.invalidateQueries(['doctor-today'])
    })

    const todayAppointments = appointments.filter(a => {
        const apptDate = new Date(a.timeSlot?.date)
        return apptDate.getFullYear() === now.getFullYear() &&
            apptDate.getMonth() === now.getMonth() &&
            apptDate.getDate() === now.getDate()
    })

    const scheduled = todayAppointments.filter(a => a.status === 'SCHEDULED')
    const completed = todayAppointments.filter(a => a.status === 'COMPLETED')
    const nextPatient = scheduled[0]

    return (
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>Приемы на сегодня</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        {now.toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <button className="btn btn-outline" onClick={() => qc.invalidateQueries(['doctor-today'])} disabled={isLoading}>
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Обновить
                </button>
            </div>

            <div className="stats-grid">
                <StatCard 
                    label="Ожидает приема" 
                    value={scheduled.length} 
                    icon={<Clock size={24} />} 
                    color="#f59e0b" 
                    delay={0.1}
                />
                <StatCard 
                    label="Завершено" 
                    value={completed.length} 
                    icon={<CheckCircle size={24} />} 
                    color="#10b981" 
                    delay={0.2}
                />
                <StatCard 
                    label="Всего на сегодня" 
                    value={todayAppointments.length} 
                    icon={<Users size={24} />} 
                    color="#2563eb" 
                    delay={0.3}
                />
            </div>

            <div className="content-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card">
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Список пациентов</h2>
                        
                        {isLoading ? (
                            <div style={{ padding: 64, textAlign: 'center' }}>
                                <RefreshCw className="animate-spin" size={32} style={{ opacity: 0.2 }} />
                            </div>
                        ) : todayAppointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 64 }} className="glass">
                                <Calendar size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
                                <p style={{ color: 'var(--text-muted)' }}>На сегодня записей нет</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {todayAppointments.map((a, i) => (
                                    <motion.div 
                                        key={a.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{ 
                                            padding: 20, 
                                            borderRadius: 16, 
                                            border: '1px solid var(--border)',
                                            background: a.id === nextPatient?.id ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <div style={{ 
                                                width: 48, 
                                                height: 48, 
                                                borderRadius: 12, 
                                                background: 'var(--primary)', 
                                                color: 'white', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                fontWeight: 800
                                            }}>
                                                {new Date(a.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 15 }}>{a.patient?.user?.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                                    {a.complaint || 'Плановый осмотр'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <span className={`badge badge-${a.status.toLowerCase()}`}>
                                                {a.status === 'SCHEDULED' ? 'Ожидает' : a.status === 'COMPLETED' ? 'Принят' : 'Отмена'}
                                            </span>
                                            {a.status === 'SCHEDULED' && (
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button 
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => updateStatus.mutate({ id: a.id, status: 'COMPLETED' })}
                                                    >
                                                        Завершить
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <AnimatePresence>
                        {nextPatient && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card glass"
                                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white', border: 'none' }}
                            >
                                <h3 style={{ fontSize: 14, fontWeight: 600, opacity: 0.8, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Следующий пациент
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                    <img src={`https://ui-avatars.com/api/?name=${nextPatient.patient?.user?.name}&background=random`} 
                                         style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)' }} alt="ava" />
                                    <div>
                                        <div style={{ fontSize: 20, fontWeight: 800 }}>{nextPatient.patient?.user?.name}</div>
                                        <div style={{ fontSize: 14, opacity: 0.9 }}>Прием в {new Date(nextPatient.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                        <Phone size={14} /> {nextPatient.patient?.user?.phone}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                        <Mail size={14} /> {nextPatient.patient?.user?.email}
                                    </div>
                                </div>
                                <button className="btn" style={{ background: 'white', color: 'var(--primary)', width: '100%', justifyContent: 'center' }}>
                                    Начать прием <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="card">
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Ваше расписание</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            У вас сегодня {todayAppointments.length} записей. Среднее время приема: 30 минут. 
                            Ближайшее свободное окно: после 18:00.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}