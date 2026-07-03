import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

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
        <div>
            <h1 className="page-title">История визитов</h1>

            {isLoading ? <p style={{ color: '#718096' }}>Загрузка...</p> : (
                <>
                    {upcoming.length > 0 && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1a365d' }}>
                                📅 Предстоящие записи ({upcoming.length})
                            </h2>
                            <table className="table">
                                <thead>
                                    <tr><th>Врач</th><th>Специальность</th><th>Дата и время</th><th>Жалоба</th><th>Действия</th></tr>
                                </thead>
                                <tbody>
                                    {upcoming.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.doctor?.user?.name}</td>
                                            <td>{a.doctor?.specialty}</td>
                                            <td>{new Date(a.timeSlot?.date).toLocaleString('ru')}</td>
                                            <td>{a.complaint || '—'}</td>
                                            <td>
                                                <button className="btn btn-danger btn-sm"
                                                    onClick={() => { if (confirm('Отменить запись?')) cancel.mutate(a.id) }}>
                                                    Отменить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '20px 24px 0' }}>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>
                                📋 История ({past.length})
                            </h2>
                        </div>
                        {past.length === 0 ? (
                            <p style={{ color: '#718096', padding: 24 }}>История визитов пуста</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr><th>Врач</th><th>Специальность</th><th>Дата и время</th><th>Статус</th><th>Заметки</th></tr>
                                </thead>
                                <tbody>
                                    {past.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.doctor?.user?.name}</td>
                                            <td>{a.doctor?.specialty}</td>
                                            <td>{new Date(a.timeSlot?.date).toLocaleString('ru')}</td>
                                            <td><span className={`badge badge-${a.status.toLowerCase()}`}>{statusLabel[a.status]}</span></td>
                                            <td>{a.notes || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}