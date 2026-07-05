import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function DoctorDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const qc = useQueryClient()

    // Берём сегодняшнюю дату в локальном времени
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['doctor-today', user.doctorId, today],
        queryFn: () => api.get(`/appointments?doctorId=${user.doctorId}&date=${today}`).then(r => r.data),
        enabled: !!user.doctorId,
        refetchInterval: 30000 // обновляем каждые 30 сек
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status, notes }) => api.put(`/appointments/${id}`, { status, notes }),
        onSuccess: () => qc.invalidateQueries(['doctor-today'])
    })

    // Фильтруем точно по сегодняшнему дню на фронте
    const todayAppointments = appointments.filter(a => {
        const apptDate = new Date(a.timeSlot?.date)
        return apptDate.getFullYear() === now.getFullYear() &&
            apptDate.getMonth() === now.getMonth() &&
            apptDate.getDate() === now.getDate()
    })

    const scheduled = todayAppointments.filter(a => a.status === 'SCHEDULED')
    const completed = todayAppointments.filter(a => a.status === 'COMPLETED')

    return (
        <div>
            <h1 className="page-title">
                Сегодня — {now.toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h1>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#bee3f8' }}>📅</div>
                    <div className="stat-info"><h3>{scheduled.length}</h3><p>Ожидает приёма</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#c6f6d5' }}>✅</div>
                    <div className="stat-info"><h3>{completed.length}</h3><p>Принято сегодня</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fefcbf' }}>👥</div>
                    <div className="stat-info"><h3>{todayAppointments.length}</h3><p>Всего записей</p></div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600 }}>Список пациентов на сегодня</h2>
                    <button className="btn btn-primary btn-sm" onClick={() => qc.invalidateQueries(['doctor-today'])}>
                        🔄 Обновить
                    </button>
                </div>

                {isLoading ? (
                    <div style={{ padding: 48, textAlign: 'center', color: '#718096' }}>Загрузка...</div>
                ) : todayAppointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                        <p style={{ color: '#718096', marginBottom: 8 }}>На сегодня записей нет</p>
                        <p style={{ color: '#a0aec0', fontSize: 13 }}>Дата: {today}</p>
                    </div>
                ) : (
                    <div>
                        {todayAppointments.map((a, i) => (
                            <div key={a.id} style={{
                                padding: '20px 24px',
                                borderBottom: i < todayAppointments.length - 1 ? '1px solid #e2e8f0' : 'none',
                                display: 'flex', alignItems: 'center', gap: 16
                            }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#bee3f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                    👤
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#1a365d', marginBottom: 2 }}>
                                        {a.patient?.user?.name}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#718096' }}>
                                        🕐 {new Date(a.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                        {a.complaint && ` · ${a.complaint}`}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#a0aec0', marginTop: 2 }}>
                                        {a.patient?.user?.phone} · {a.patient?.user?.email}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                    <span className={`badge badge-${a.status.toLowerCase()}`}>
                                        {a.status === 'SCHEDULED' ? 'Ожидает' : a.status === 'COMPLETED' ? 'Завершён' : 'Отменён'}
                                    </span>
                                    {a.status === 'SCHEDULED' && (
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-success btn-sm"
                                                onClick={() => updateStatus.mutate({ id: a.id, status: 'COMPLETED' })}>
                                                ✓ Принят
                                            </button>
                                            <button className="btn btn-danger btn-sm"
                                                onClick={() => updateStatus.mutate({ id: a.id, status: 'CANCELLED' })}>
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}