import { useEffect, useState } from 'react'
import api from '../../api'

export default function Dashboard() {
    const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 })
    const [appointments, setAppointments] = useState([])

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
        <div>
            <h1 className="page-title">Дашборд</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#bee3f8' }}>👥</div>
                    <div className="stat-info">
                        <h3>{stats.patients}</h3>
                        <p>Пациентов</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#c6f6d5' }}>👨‍⚕️</div>
                    <div className="stat-info">
                        <h3>{stats.doctors}</h3>
                        <p>Врачей</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fefcbf' }}>📅</div>
                    <div className="stat-info">
                        <h3>{stats.appointments}</h3>
                        <p>Записей сегодня</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Записи на сегодня</h2>
                {appointments.length === 0 ? (
                    <p style={{ color: '#718096' }}>Нет записей на сегодня</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Пациент</th>
                                <th>Врач</th>
                                <th>Время</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.id}>
                                    <td>{a.patient.firstName} {a.patient.lastName}</td>
                                    <td>{a.doctor.name}</td>
                                    <td>{new Date(a.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}