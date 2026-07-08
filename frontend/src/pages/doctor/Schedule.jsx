import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import { Calendar, Clock, Plus, Trash2, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DoctorSchedule() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [times, setTimes] = useState([])
    const qc = useQueryClient()

    const { data: slots = [], isLoading } = useQuery({
        queryKey: ['my-slots', user.doctorId, date],
        queryFn: () => api.get(`/doctors/${user.doctorId}/slots?date=${date}`).then(r => r.data),
        enabled: !!user.doctorId
    })

    const addSlots = useMutation({
        mutationFn: () => {
            const slotDates = times.map(t => {
                const [hours, minutes] = t.split(':')
                const d = new Date(date)
                d.setHours(Number(hours), Number(minutes), 0, 0)
                return d.toISOString()
            })
            return api.post(`/doctors/${user.doctorId}/slots`, { slots: slotDates })
        },
        onSuccess: () => { qc.invalidateQueries(['my-slots']); setTimes([]) },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка')
    })

    const deleteSlot = useMutation({
        mutationFn: (id) => api.delete(`/appointments/slots/${id}`), 
        onSuccess: () => qc.invalidateQueries(['my-slots'])
    })

    const presetTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

    const toggleTime = (t) => {
        setTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
    }

    return (
        <div className="animate-in">
            <h1 className="page-title" style={{ marginBottom: 32 }}>Редактор расписания</h1>

            <div className="content-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                                <Calendar size={20} />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>1. Выберите дату</h2>
                        </div>
                        
                        <div className="form-group">
                            <input 
                                type="date" 
                                value={date} 
                                min={new Date().toISOString().split('T')[0]} 
                                onChange={e => setDate(e.target.value)} 
                                style={{ height: 56, fontSize: 16, fontWeight: 600, backgroundColor: 'transparent' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32, marginBottom: 20 }}>
                            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <Clock size={20} />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>2. Время приема</h2>
                        </div>

                        <div className="slots-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12, marginBottom: 24 }}>
                            {presetTimes.map(t => (
                                <button key={t} 
                                    className={`slot-item ${times.includes(t) ? 'selected' : ''}`}
                                    onClick={() => toggleTime(t)}
                                    style={{ padding: '12px 0', fontSize: 14 }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', height: 56, fontSize: 16 }} 
                            onClick={() => addSlots.mutate()} disabled={times.length === 0 || addSlots.isPending}>
                            <Plus size={20} /> {addSlots.isPending ? 'Добавляем...' : `Создать ${times.length} окна`}
                        </button>
                    </div>

                    <div className="card glass">
                        <div style={{ display: 'flex', gap: 12 }}>
                            <AlertCircle size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                Выберите дату и кликните по нужным часам, чтобы открыть запись для пациентов. 
                                Уже занятые или отмененные слоты будут отображаться в списке справа.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Активные слоты</h2>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                {new Date(date).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="badge badge-scheduled">{slots.length}</div>
                    </div>

                    <div style={{ flex: 1, padding: 24 }}>
                        {isLoading ? (
                            <div style={{ padding: 48, textAlign: 'center' }}><div className="animate-spin" style={{ display: 'inline-block' }}>⌛</div></div>
                        ) : slots.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '64px 0' }}>
                                <Calendar size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Слотов на эту дату пока нет</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {slots.map((s, i) => (
                                    <motion.div 
                                        key={s.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{ 
                                            padding: '16px 20px', 
                                            borderRadius: 12, 
                                            background: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ 
                                                width: 8, height: 8, borderRadius: '50%', 
                                                background: s.available ? '#10b981' : '#ef4444' 
                                            }} />
                                            <span style={{ fontWeight: 700, fontSize: 15 }}>
                                                {new Date(s.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                {s.available ? 'Свободно' : 'Занято'}
                                            </span>
                                        </div>
                                        {s.available && (
                                            <button className="btn btn-outline" style={{ padding: 6, color: '#ef4444' }} onClick={() => {
                                                if(confirm('Удалить этот слот?')) deleteSlot.mutate(s.id)
                                            }}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}