import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    useEffect(() => {
        api.get('/appointments/my').then(r => {
            setAppointments(r.data.slice(0, 3))
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const upcoming = appointments.filter(a => a.status === 'SCHEDULED')
    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    return (
        <div>
            <div className="patient-welcome">
                <div>
                    <h1>Добро пожаловать, {user.name}! 👋</h1>
                    <p>Здесь вы можете управлять своими записями к врачу</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/patient/appointments')}>
                    + Записаться к врачу
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#bee3f8' }}>📅</div>
                    <div className="stat-info">
                        <h3>{upcoming.length}</h3>
                        <p>Предстоящих записей</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#c6f6d5' }}>✅</div>
                    <div className="stat-info">
                        <h3>{appointments.filter(a => a.status === 'COMPLETED').length}</h3>
                        <p>Завершённых приёмов</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fefcbf' }}>🦷</div>
                    <div className="stat-info">
                        <h3>{appointments.length}</h3>
                        <p>Всего визитов</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600 }}>Ближайшие записи</h2>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/history')}>Вся история</button>
                </div>
                {loading ? <p style={{ color: '#718096' }}>Загрузка...</p> : appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🦷</div>
                        <p style={{ color: '#718096', marginBottom: 16 }}>У вас пока нет записей</p>
                        <button className="btn btn-primary" onClick={() => navigate('/patient/appointments')}>Записаться сейчас</button>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr><th>Врач</th><th>Специальность</th><th>Дата и время</th><th>Статус</th></tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.id}>
                                    <td>{a.doctor?.user?.name}</td>
                                    <td>{a.doctor?.specialty}</td>
                                    <td>{new Date(a.timeSlot?.date).toLocaleString('ru')}</td>
                                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{statusLabel[a.status]}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}