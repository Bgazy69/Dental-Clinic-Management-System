import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { Calendar, CheckCircle2, Clock, Plus, ArrowRight, User, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../../components/StatCard'

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    useEffect(() => {
        api.get('/appointments/my').then(r => {
            setAppointments(r.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const upcoming = appointments.filter(a => a.status === 'SCHEDULED')
    const completed = appointments.filter(a => a.status === 'COMPLETED')
    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    return (
        <div className="animate-in">
            <div className="patient-welcome" style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
                padding: '40px',
                borderRadius: '24px',
                color: 'white',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)'
            }}>
                <div style={{ maxWidth: '60%' }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Рады вас видеть, {user.name}! 👋</h1>
                    <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>
                        Ваш план лечения под контролем. Просматривайте историю посещений или запишитесь на новый прием прямо сейчас.
                    </p>
                    <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '12px 24px' }} onClick={() => navigate('/patient/appointments')}>
                        <Plus size={18} style={{ marginRight: 8 }} /> Новая запись
                    </button>
                </div>
                <div style={{ fontSize: 100, opacity: 0.2, userSelect: 'none' }}>🦷</div>
            </div>

            <div className="stats-grid" style={{ marginBottom: 32 }}>
                <StatCard 
                    title="Предстоящие" 
                    value={upcoming.length} 
                    icon={<Calendar />} 
                    color="primary"
                    trend="Ближайшие записи"
                />
                <StatCard 
                    title="Завершено" 
                    value={completed.length} 
                    icon={<CheckCircle2 />} 
                    color="success"
                    trend="Всего визитов"
                />
                <StatCard 
                    title="Сообщений" 
                    value={0} 
                    icon={<Clock />} 
                    color="warning"
                    trend="Центр уведомлений"
                />
            </div>

            <div className="content-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Ближайшие приемы</h2>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate('/patient/appointments')}>Все записи</button>
                    </div>
                    
                    <div style={{ padding: 24 }}>
                        {loading ? (
                            <div style={{ padding: 40, textAlign: 'center' }}>Загрузка...</div>
                        ) : upcoming.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <Calendar size={40} style={{ opacity: 0.1, marginBottom: 16 }} />
                                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>У вас нет запланированных визитов</p>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/appointments')}>Записаться</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {upcoming.slice(0, 3).map((a, i) => (
                                    <motion.div 
                                        key={a.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{ 
                                            padding: '20px', 
                                            background: 'var(--background)', 
                                            borderRadius: 16, 
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Stethoscope size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 15 }}>{a.doctor?.user?.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.doctor?.specialty}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{new Date(a.timeSlot?.date).toLocaleDateString('ru')}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(a.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card glass">
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Полезные советы</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ fontSize: 20 }}>🪥</div>
                            <p style={{ fontSize: 13, lineHeight: 1.5 }}>Чистите зубы дважды в день не менее 2 минут для здоровья эмали.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ fontSize: 20 }}>🍏</div>
                            <p style={{ fontSize: 13, lineHeight: 1.5 }}>Свежие овощи и фрукты способствуют естественному очищению зубов.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ fontSize: 20 }}>🗓️</div>
                            <p style={{ fontSize: 13, lineHeight: 1.5 }}>Посещайте стоматолога раз в полгода для профилактики.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}