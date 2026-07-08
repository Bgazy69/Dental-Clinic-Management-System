import { useEffect, useState } from 'react'
import api from '../../api'
import StatCard from '../../components/StatCard'
import { Users, UserRound, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 })
    const [appointments, setAppointments] = useState([])
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]
        Promise.all([
            api.get('/patients'),
            api.get('/doctors'),
            api.get(`/appointments?date=${today}`)
        ]).then(([p, d, a]) => {
            setStats({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length })
            setAppointments(a.data.slice(0, 5))
        })
    }, [])

    return (
        <div className="dashboard-container">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="welcome-banner"
            >
                <h1>С возвращением, {user.name.split(' ')[0]}! 👋</h1>
                <p>Все системы работают в штатном режиме. Сегодня запланировано {stats.appointments} встреч.</p>
            </motion.div>

            <div className="stats-grid">
                <StatCard 
                    label="Всего пациентов" 
                    value={stats.patients} 
                    icon={<Users size={24} />} 
                    color="#2563eb" 
                    delay={0.1}
                />
                <StatCard 
                    label="Врачи в штате" 
                    value={stats.doctors} 
                    icon={<UserRound size={24} />} 
                    color="#10b981" 
                    delay={0.2}
                />
                <StatCard 
                    label="Записи сегодня" 
                    value={stats.appointments} 
                    icon={<CalendarIcon size={24} />} 
                    color="#8b5cf6" 
                    delay={0.3}
                />
            </div>

            <div className="content-grid">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Ближайшие записи</h2>
                        <button className="btn btn-outline" style={{ fontSize: 12 }}>Посмотреть все</button>
                    </div>
                    
                    {appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                            <Clock size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                            <p>На сегодня записей пока нет</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Пациент</th>
                                        <th>Врач</th>
                                        <th>Время</th>
                                        <th>Статус</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((a, i) => (
                                        <motion.tr 
                                            key={a.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            <td style={{ fontWeight: 600 }}>{a.patient.user.name}</td>
                                            <td>{a.doctor.user.name}</td>
                                            <td>{new Date(a.timeSlot.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                                            <td><ArrowRight size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} /></td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="card glass">
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Активность клиники</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[
                            { label: 'Заполнение клиники', val: '84%', color: '#2563eb' },
                            { label: 'Удовлетворенность', val: '98%', color: '#10b981' },
                            { label: 'Новые пациенты', val: '+12', color: '#8b5cf6' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                                    <span style={{ fontWeight: 700 }}>{item.val}</span>
                                </div>
                                <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: item.val.includes('%') ? item.val : '60%' }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                        style={{ height: '100%', background: item.color }}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}