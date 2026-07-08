import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import { Calendar, Clock, XCircle, CheckCircle, ChevronRight, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PatientHistory() {
    const qc = useQueryClient()

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['my-appointments'],
        queryFn: () => api.get('/appointments/my').then(r => r.data)
    })

    const cancel = useMutation({
        mutationFn: (id) => api.put(`/appointments/${id}`, { status: 'CANCELLED' }),
        onSuccess: () => qc.invalidateQueries(['my-appointments'])
    })

    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    const upcoming = appointments.filter(a => a.status === 'SCHEDULED')
    const past = appointments.filter(a => a.status !== 'SCHEDULED')

    return (
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 className="page-title" style={{ margin: 0 }}>История ваших визитов</h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline btn-sm"><Filter size={14} /> Фильтр</button>
                    <div className="badge badge-primary">{appointments.length} всего</div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>Загрузка...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {upcoming.length > 0 && (
                        <section>
                            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Calendar size={20} color="var(--primary)" /> Предстоящие приемы
                            </h2>
                            <div className="card" style={{ padding: 0 }}>
                                <table className="table">
                                    <thead>
                                        <tr><th>Врач</th><th>Дата и время</th><th>Жалоба</th><th>Действия</th></tr>
                                    </thead>
                                    <tbody>
                                        {upcoming.map((a, i) => (
                                            <motion.tr 
                                                key={a.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{a.doctor?.user?.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.doctor?.specialty}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{new Date(a.timeSlot?.date).toLocaleDateString('ru')}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(a.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td><span style={{ fontSize: 13 }}>{a.complaint || '—'}</span></td>
                                                <td>
                                                    <button className="btn btn-outline" style={{ padding: '6px 12px', color: '#ef4444', fontSize: 12 }}
                                                        onClick={() => { if (confirm('Отменить запись?')) cancel.mutate(a.id) }}>
                                                        <XCircle size={14} style={{ marginRight: 6 }} /> Отменить
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock size={20} color="var(--text-muted)" /> Прошедшие визиты
                        </h2>
                        <div className="card" style={{ padding: 0 }}>
                            {past.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 48 }}>
                                    <Clock size={40} style={{ opacity: 0.1, marginBottom: 16 }} />
                                    <p style={{ color: 'var(--text-muted)' }}>История визитов пуста</p>
                                </div>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr><th>Врач</th><th>Дата</th><th>Результат</th><th>Статус</th></tr>
                                    </thead>
                                    <tbody>
                                        {past.map(a => (
                                            <tr key={a.id}>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{a.doctor?.user?.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.doctor?.specialty}</div>
                                                </td>
                                                <td>{new Date(a.timeSlot?.date).toLocaleDateString('ru')}</td>
                                                <td style={{ maxWidth: 200, fontSize: 13 }}>{a.notes || 'Заметки не добавлены'}</td>
                                                <td><span className={`badge badge-${a.status.toLowerCase()}`}>{statusLabel[a.status]}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    )
}