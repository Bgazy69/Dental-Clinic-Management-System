import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import { Calendar, User, UserRound, Clock, CheckCircle, XCircle, Plus, Search, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Appointments() {
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({ patientId: '', doctorId: '', timeSlotId: '', complaint: '' })
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const qc = useQueryClient()

    const { data: appointments = [] } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => api.get('/appointments').then(r => r.data)
    })

    const { data: patients = [] } = useQuery({
        queryKey: ['patients'],
        queryFn: () => api.get('/patients').then(r => r.data)
    })

    const { data: doctors = [] } = useQuery({
        queryKey: ['doctors'],
        queryFn: () => api.get('/doctors').then(r => r.data)
    })

    const { data: slots = [] } = useQuery({
        queryKey: ['slots', selectedDoctor, selectedDate],
        queryFn: () => api.get(`/doctors/${selectedDoctor}/slots?date=${selectedDate}`).then(r => r.data),
        enabled: !!selectedDoctor && !!selectedDate
    })

    const create = useMutation({
        mutationFn: (data) => api.post('/appointments', data),
        onSuccess: () => {
            qc.invalidateQueries(['appointments'])
            qc.invalidateQueries(['slots'])
            setModal(false)
            setForm({ patientId: '', doctorId: '', timeSlotId: '', complaint: '' })
            setSelectedDoctor('')
            setSelectedDate('')
        },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка')
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => api.put(`/appointments/${id}`, { status }),
        onSuccess: () => qc.invalidateQueries(['appointments'])
    })

    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    return (
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Управление записями</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>
                    <Plus size={18} /> Новая запись
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Пациент</th>
                                <th>Врач</th>
                                <th>Дата и время</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((a, i) => (
                                <motion.tr 
                                    key={a.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{a.patient?.user?.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.complaint || 'Жалоба не указана'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <UserRound size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{a.doctor?.user?.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.doctor?.specialty}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                            <span>{new Date(a.timeSlot?.date).toLocaleDateString('ru')}</span>
                                            <Clock size={14} style={{ color: 'var(--text-muted)', marginLeft: 8 }} />
                                            <span>{new Date(a.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${a.status.toLowerCase()}`}>
                                            {statusLabel[a.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {a.status === 'SCHEDULED' ? (
                                                <>
                                                    <button className="btn btn-outline" style={{ padding: 6, color: '#10b981' }} onClick={() => updateStatus.mutate({ id: a.id, status: 'COMPLETED' })} title="Завершить">
                                                        <CheckCircle size={14} />
                                                    </button>
                                                    <button className="btn btn-outline" style={{ padding: 6, color: '#ef4444' }} onClick={() => updateStatus.mutate({ id: a.id, status: 'CANCELLED' })} title="Отменить">
                                                        <XCircle size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="btn btn-outline" style={{ padding: 6 }}><MoreHorizontal size={14} /></button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay" onClick={() => setModal(false)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal" 
                            onClick={e => e.stopPropagation()}
                            style={{ width: 520 }}
                        >
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Новая запись на прием</h2>
                            <div className="form-group">
                                <label>Выберите пациента</label>
                                <select className="search-input" style={{ width: '100%', height: 48, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', background: 'transparent' }} value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
                                    <option value="">— Пациент —</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.user?.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Специалист</label>
                                <select className="search-input" style={{ width: '100%', height: 48, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', background: 'transparent' }} value={selectedDoctor} onChange={e => {
                                    setSelectedDoctor(e.target.value)
                                    setForm({ ...form, doctorId: e.target.value, timeSlotId: '' })
                                }}>
                                    <option value="">— Врач —</option>
                                    {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.name} ({d.specialty})</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>Дата</label>
                                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Свободное время</label>
                                    <select className="search-input" style={{ width: '100%', height: 48, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', background: 'transparent' }} value={form.timeSlotId} onChange={e => setForm({ ...form, timeSlotId: e.target.value })} disabled={!slots.length}>
                                        <option value="">— Время —</option>
                                        {slots.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {new Date(s.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Причина обращения</label>
                                <textarea 
                                    className="search-input" 
                                    style={{ width: '100%', height: 80, border: '1px solid var(--border)', borderRadius: 8, padding: 12, background: 'transparent' }} 
                                    placeholder="Опишите жалобу..." 
                                    value={form.complaint} 
                                    onChange={e => setForm({ ...form, complaint: e.target.value })} 
                                />
                            </div>
                            <div className="modal-actions" style={{ marginTop: 24 }}>
                                <button className="btn btn-outline" onClick={() => setModal(false)}>Отмена</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => create.mutate({ ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId), timeSlotId: Number(form.timeSlotId) })}
                                    disabled={!form.patientId || !form.doctorId || !form.timeSlotId || create.isPending}
                                >
                                    {create.isPending ? 'Загрузка...' : 'Записать пациента'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}