import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../api'

export default function DoctorPatients() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [selected, setSelected] = useState(null)

    const { data: appointments = [] } = useQuery({
        queryKey: ['doctor-patients', user.doctorId],
        queryFn: () => api.get(`/appointments?doctorId=${user.doctorId}`).then(r => r.data),
        enabled: !!user.doctorId
    })

    const uniquePatients = [...new Map(appointments.map(a => [a.patient?.id, a.patient])).values()].filter(Boolean)

    const patientAppointments = selected
        ? appointments.filter(a => a.patient?.id === selected.id)
        : []

    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    return (
        <div>
            <h1 className="page-title">Мои пациенты</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
                <div className="card" style={{ padding: 0, alignSelf: 'start' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 14 }}>
                        Всего пациентов: {uniquePatients.length}
                    </div>
                    {uniquePatients.map(p => (
                        <div key={p.id} onClick={() => setSelected(p)} style={{
                            padding: '14px 20px', cursor: 'pointer',
                            background: selected?.id === p.id ? '#ebf8ff' : 'transparent',
                            borderBottom: '1px solid #f0f0f0',
                            borderLeft: selected?.id === p.id ? '3px solid #3182ce' : '3px solid transparent'
                        }}>
                            <div style={{ fontWeight: 600, color: '#1a365d', fontSize: 14 }}>{p.user?.name}</div>
                            <div style={{ color: '#718096', fontSize: 12 }}>{p.user?.phone}</div>
                        </div>
                    ))}
                    {uniquePatients.length === 0 && <p style={{ padding: 20, color: '#718096', fontSize: 14 }}>Пациентов нет</p>}
                </div>

                <div>
                    {selected ? (
                        <>
                            <div className="card" style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#bee3f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a365d' }}>{selected.user?.name}</h2>
                                        <p style={{ color: '#718096', fontSize: 13 }}>{selected.user?.phone} · {selected.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{ padding: 0 }}>
                                <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>История визитов</div>
                                <table className="table">
                                    <thead>
                                        <tr><th>Дата</th><th>Жалоба</th><th>Заметки</th><th>Статус</th></tr>
                                    </thead>
                                    <tbody>
                                        {patientAppointments.map(a => (
                                            <tr key={a.id}>
                                                <td>{new Date(a.timeSlot?.date).toLocaleString('ru')}</td>
                                                <td>{a.complaint || '—'}</td>
                                                <td>{a.notes || '—'}</td>
                                                <td><span className={`badge badge-${a.status.toLowerCase()}`}>{statusLabel[a.status]}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>👈</div>
                            <p style={{ color: '#718096' }}>Выберите пациента слева</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}