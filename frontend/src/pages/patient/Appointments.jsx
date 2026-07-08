import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import { UserRound, Calendar as CalendarIcon, Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PatientAppointments() {
    const [step, setStep] = useState(1)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [complaint, setComplaint] = useState('')
    const [done, setDone] = useState(false)
    const qc = useQueryClient()

    const { data: doctors = [] } = useQuery({
        queryKey: ['doctors'],
        queryFn: () => api.get('/doctors').then(r => r.data)
    })

    const { data: slots = [] } = useQuery({
        queryKey: ['slots', selectedDoctor?.id, selectedDate],
        queryFn: () => api.get(`/doctors/${selectedDoctor.id}/slots?date=${selectedDate}`).then(r => r.data),
        enabled: !!selectedDoctor && !!selectedDate
    })

    const book = useMutation({
        mutationFn: () => api.post('/appointments', {
            doctorId: selectedDoctor.id,
            timeSlotId: selectedSlot.id,
            complaint
        }),
        onSuccess: () => {
            qc.invalidateQueries(['slots'])
            setDone(true)
        },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка записи')
    })

    if (done) return (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                style={{ fontSize: 80, marginBottom: 32, display: 'inline-block', padding: 24, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
            >
                <CheckCircle size={80} />
            </motion.div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Вы успешно записаны!</h2>
            <div className="card" style={{ maxWidth: 400, margin: '0 auto 40px', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Врач:</span>
                        <span style={{ fontWeight: 700 }}>{selectedDoctor?.user?.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Дата и время:</span>
                        <span style={{ fontWeight: 700 }}>{new Date(selectedSlot?.date).toLocaleString('ru', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary" onClick={() => { setDone(false); setStep(1); setSelectedDoctor(null); setSelectedDate(''); setSelectedSlot(null); setComplaint('') }}>
                Записаться ещё раз
            </button>
        </div>
    )

    return (
        <div className="animate-in">
            <h1 className="page-title" style={{ marginBottom: 40 }}>Запись на прием</h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
                <div style={{ display: 'flex', gap: 0, maxWidth: 600, width: '100%' }}>
                    {['Врач', 'Время', 'Детали'].map((s, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: step > i ? 'var(--secondary)' : step === i + 1 ? 'var(--primary)' : 'var(--border)',
                                color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
                                transform: step === i + 1 ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.3s'
                            }}>
                                {step > i ? <CheckCircle size={20} /> : i + 1}
                            </div>
                            <div style={{ marginLeft: 12 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: step >= i + 1 ? 'var(--text)' : 'var(--text-muted)' }}>{s}</div>
                            </div>
                            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--secondary)' : 'var(--border)', margin: '0 16px' }} />}
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Выберите специалиста</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                            {doctors.map(d => (
                                <div key={d.id} 
                                    className="card"
                                    onClick={() => { setSelectedDoctor(d); setStep(2) }}
                                    style={{
                                        cursor: 'pointer',
                                        border: `2px solid ${selectedDoctor?.id === d.id ? 'var(--primary)' : 'var(--border)'}`,
                                        padding: 32, textAlign: 'center'
                                    }}
                                >
                                    <img src={`https://ui-avatars.com/api/?name=${d.user?.name}&background=random`} 
                                         style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 20, border: '4px solid var(--background)' }} 
                                         alt="doctor" 
                                    />
                                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{d.user?.name}</h3>
                                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{d.specialty}</div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>
                                        {d.bio || 'Специалист широкого профиля с многолетним опытом.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                            <button onClick={() => setStep(1)} className="btn btn-outline" style={{ padding: 10 }}><ChevronLeft size={20} /></button>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Дата и время</h2>
                        </div>
                        
                        <div className="content-grid">
                            <div className="card">
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>1. Выберите дату</h3>
                                <div className="form-group" style={{ maxWidth: 300 }}>
                                    <input type="date" value={selectedDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null) }}
                                        style={{ height: 48, fontSize: 16 }}
                                    />
                                </div>

                                {selectedDate && (
                                    <div style={{ marginTop: 32 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>2. Доступное время</h3>
                                        {slots.length === 0 ? (
                                            <div style={{ padding: 24, background: 'rgba(239, 68, 68, 0.05)', borderRadius: 12, display: 'flex', gap: 12, color: '#ef4444' }}>
                                                <AlertCircle size={20} />
                                                <p style={{ fontSize: 14 }}>На выбранную дату нет свободного времени.</p>
                                            </div>
                                        ) : (
                                            <div className="slots-grid">
                                                {slots.map(s => (
                                                    <div key={s.id} 
                                                        className={`slot-item ${selectedSlot?.id === s.id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedSlot(s)}
                                                    >
                                                        {new Date(s.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="card glass">
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Ваш выбор</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                    <img src={`https://ui-avatars.com/api/?name=${selectedDoctor?.user?.name}&background=random`} 
                                         style={{ width: 48, height: 48, borderRadius: '50%' }} alt="doc" />
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{selectedDoctor?.user?.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedDoctor?.specialty}</div>
                                    </div>
                                </div>
                                {selectedDate && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--primary)', fontWeight: 600 }}>
                                        <CalendarIcon size={18} /> {new Date(selectedDate).toLocaleDateString('ru', { day: 'numeric', month: 'long' })}
                                    </div>
                                )}
                                {selectedSlot && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--secondary)', fontWeight: 600, marginTop: 8 }}>
                                        <Clock size={18} /> {new Date(selectedSlot.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}

                                {selectedSlot && (
                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 32 }} onClick={() => setStep(3)}>
                                        Продолжить <ChevronRight size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ maxWidth: 600, margin: '0 auto' }}
                    >
                        <button onClick={() => setStep(2)} className="btn btn-outline" style={{ marginBottom: 24 }}><ChevronLeft size={18} /> Назад</button>
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Завершение записи</h2>
                        <div className="card" style={{ marginBottom: 32 }}>
                            <div className="form-group">
                                <label style={{ marginBottom: 12 }}>Опишите вашу проблему или причину визита</label>
                                <textarea 
                                    placeholder="Например: острая зубная боль, профилактический осмотр..." 
                                    style={{ width: '100%', height: 120, border: '1px solid var(--border)', borderRadius: 12, padding: 16, fontSize: 15, backgroundColor: 'transparent' }}
                                    value={complaint} 
                                    onChange={e => setComplaint(e.target.value)} 
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', padding: 18, fontSize: 18, borderRadius: 16 }}
                            onClick={() => book.mutate()} disabled={book.isPending}>
                            {book.isPending ? 'Записываем вас...' : '✓ Подтвердить запись'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}