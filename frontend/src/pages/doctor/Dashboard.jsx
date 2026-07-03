import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function DoctorDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const today = new Date().toISOString().split('T')[0]
    const qc = useQueryClient()

    const { data: appointments = [] } = useQuery({
        queryKey: ['doctor-today', user.doctorId],
        queryFn: () => api.get(`/appointments?doctorId=${user.doctorId}&date=${today}`).then(r => r.data),
        enabled: !!user.doctorId
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status, notes }) => api.put(`/appointments/${id}`, { status, notes }),
        onSuccess: () => qc.invalidateQueries(['doctor-today'])
    })

    const scheduled = appointments.filter(a => a.status === 'SCHEDULED')
    const completed = appointments.filter(a => a.status === 'COMPLETED')

    return (
        <div>
            <h1 className="page-title">Сегодня — {new Date().toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}</h1>

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
                    <div className="stat-info"><h3>{appointments.length}</h3><p>Всего записей</p></div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600 }}>Список пациентов на сегодня</h2>
                </div>
                {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                        <p style={{ color: '#718096' }}>На сегодня записей нет</p>
                    </div>
                ) : (
                    <div>
                        {appointments.map((a, i) => (
                            <div key={a.id} style={{
                                padding: '20px 24px',
                                borderBottom: i < appointments.length - 1 ? '1px solid #e2e8f0' : 'none',
                                display: 'flex', alignItems: 'center', gap: 16
                            }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#bee3f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                    👤
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#1a365d' }}>{a.patient?.user?.name}</div>
                                    <div style={{ fontSize: 13, color: '#718096' }}>
                                        {new Date(a.timeSlot?.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                        {a.complaint && ` · ${a.complaint}`}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#718096' }}>{a.patient?.user?.phone}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <span className={`badge badge-${a.status.toLowerCase()}`}>
                                        {a.status === 'SCHEDULED' ? 'Ожидает' : a.status === 'COMPLETED' ? 'Завершён' : 'Отменён'}
                                    </span>
                                    {a.status === 'SCHEDULED' && (
                                        <button className="btn btn-success btn-sm"
                                            onClick={() => updateStatus.mutate({ id: a.id, status: 'COMPLETED' })}>
                                            ✓ Принят
                                        </button>
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