import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../api'
import { Search, User, Phone, Mail, Calendar, MessageSquare, ChevronRight, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DoctorPatients() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [selected, setSelected] = useState(null)
    const [search, setSearch] = useState('')

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['doctor-patients', user.doctorId],
        queryFn: () => api.get(`/appointments?doctorId=${user.doctorId}`).then(r => r.data),
        enabled: !!user.doctorId
    })

    const uniquePatients = [...new Map(appointments.map(a => [a.patient?.id, a.patient])).values()].filter(Boolean)
    
    const filteredPatients = uniquePatients.filter(p => 
        p.user?.name.toLowerCase().includes(search.toLowerCase())
    )

    const patientAppointments = selected
        ? appointments.filter(a => a.patient?.id === selected.id)
        : []

    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    return (
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Моя база пациентов</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="badge badge-primary"><Users size={14} style={{ marginRight: 6 }} /> {uniquePatients.length} пациентов</div>
                </div>
            </div>

            <div className="content-grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="search-box" style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--text-muted)' }} />
                        <input 
                            className="search-input" 
                            style={{ width: '100%', height: 44, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--background)' }} 
                            placeholder="Поиск по имени..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden', height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                        {isLoading ? (
                            <div style={{ padding: 40, textAlign: 'center' }}>Загрузка...</div>
                        ) : filteredPatients.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Ничего не найдено</div>
                        ) : (
                            filteredPatients.map(p => (
                                <div 
                                    key={p.id} 
                                    onClick={() => setSelected(p)} 
                                    style={{
                                        padding: '16px 20px', 
                                        cursor: 'pointer',
                                        background: selected?.id === p.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                                        borderBottom: '1px solid var(--border)',
                                        borderLeft: selected?.id === p.id ? '4px solid var(--primary)' : '4px solid transparent',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                                            {p.user?.name[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: selected?.id === p.id ? 'var(--primary)' : 'inherit' }}>{p.user?.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{p.user?.phone}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} style={{ opacity: selected?.id === p.id ? 1 : 0.2 }} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selected ? (
                        <motion.div 
                            key={selected.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                        >
                            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                    <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>
                                        {selected.user?.name[0]}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 24, fontWeight: 800 }}>{selected.user?.name}</h2>
                                        <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                                                <Phone size={14} /> {selected.user?.phone}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                                                <Mail size={14} /> {selected.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-outline">Редактировать карту</button>
                            </div>

                            <div className="card" style={{ padding: 0 }}>
                                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Calendar size={18} color="var(--primary)" />
                                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>История лечений</h2>
                                </div>
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Дата приема</th><th>Жалоба / Диагноз</th><th>Лечение / Заметки</th><th>Статус</th></tr>
                                        </thead>
                                        <tbody>
                                            {patientAppointments.map(a => (
                                                <tr key={a.id}>
                                                    <td style={{ fontWeight: 600 }}>{new Date(a.timeSlot?.date).toLocaleString('ru', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                    <td><div style={{ fontSize: 13, color: 'var(--text-main)' }}>{a.complaint || '—'}</div></td>
                                                    <td><div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 250 }}>{a.notes || '—'}</div></td>
                                                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{statusLabel[a.status]}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 400, opacity: 0.6 }}>
                            <div style={{ padding: 32, borderRadius: '50%', background: 'var(--border)', marginBottom: 24 }}>
                                <User size={48} />
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Пациент не выбран</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Выберите пациента из списка слева для просмотра медкарты</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}