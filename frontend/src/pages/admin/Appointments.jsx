import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function Appointments() {
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({ patientId: '', doctorId: '', timeSlotId: '', complaint: '' })
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const qc = useQueryClient()

    const { data: appointments = [] } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => api.get('/appointments').then(r => r.data)
    })

    const { data: patients = [] } = useQuery({
        queryKey: ['patients'],
        queryFn: () => api.get('/patients').then(r => r.data)
    })

    const { data: doctors = [] } = useQuery({
        queryKey: ['doctors'],
        queryFn: () => api.get('/doctors').then(r => r.data)
    })

    const { data: slots = [] } = useQuery({
        queryKey: ['slots', selectedDoctor, selectedDate],
        queryFn: () => api.get(`/doctors/${selectedDoctor}/slots?date=${selectedDate}`).then(r => r.data),
        enabled: !!selectedDoctor && !!selectedDate
    })

    const create = useMutation({
        mutationFn: (data) => api.post('/appointments', data),
        onSuccess: () => {
            qc.invalidateQueries(['appointments'])
            qc.invalidateQueries(['slots'])
            setModal(false)
            setForm({ patientId: '', doctorId: '', timeSlotId: '', complaint: '' })
            setSelectedDoctor('')
            setSelectedDate('')
        },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка')
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => api.put(`/appointments/${id}`, { status }),
        onSuccess: () => qc.invalidateQueries(['appointments'])
    })

    const statusLabel = { SCHEDULED: 'Запланирован', COMPLETED: 'Завершён', CANCELLED: 'Отменён' }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Записи на приём</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>+ Новая запись</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr><th>Пациент</th><th>Врач</th><th>Дата и время</th><th>Жалоба</th><th>Статус</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => (
                            <tr key={a.id}>
                                <td>{a.patient?.user?.name}</td>
                                <td>{a.doctor?.user?.name}</td>
                                <td>{new Date(a.timeSlot?.date).toLocaleString('ru')}</td>
                                <td>{a.complaint || '—'}</td>
                                <td><span className={`badge badge-${a.status.toLowerCase()}`}>{statusLabel[a.status]}</span></td>
                                <td style={{ display: 'flex', gap: 6 }}>
                                    {a.status === 'SCHEDULED' && <>
                                        <button className="btn btn-success btn-sm" onClick={() => updateStatus.mutate({ id: a.id, status: 'COMPLETED' })}>✓ Завершить</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus.mutate({ id: a.id, status: 'CANCELLED' })}>✕ Отменить</button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                        {appointments.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#718096', padding: 32 }}>Записей нет</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Новая запись</h2>
                        <div className="form-group">
                            <label>Пациент *</label>
                            <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
                                <option value="">Выберите пациента</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.user?.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Врач *</label>
                            <select value={selectedDoctor} onChange={e => {
                                setSelectedDoctor(e.target.value)
                                setForm({ ...form, doctorId: e.target.value, timeSlotId: '' })
                            }}>
                                <option value="">Выберите врача</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.name} — {d.specialty}</option>)}
                            </select>
                        </div>
                        {selectedDoctor && (
                            <div className="form-group">
                                <label>Дата *</label>
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            </div>
                        )}
                        {slots.length > 0 && (
                            <div className="form-group">
                                <label>Время *</label>
                                <select value={form.timeSlotId} onChange={e => setForm({ ...form, timeSlotId: e.target.value })}>
                                    <option value="">Выберите время</option>
                                    {slots.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {new Date(s.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {selectedDoctor && selectedDate && slots.length === 0 && (
                            <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>
                                Нет доступных слотов на эту дату. Сначала добавьте слоты для врача.
                            </p>
                        )}
                        <div className="form-group">
                            <label>Жалоба пациента</label>
                            <input placeholder="Опишите проблему" value={form.complaint} onChange={e => setForm({ ...form, complaint: e.target.value })} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setModal(false)}>Отмена</button>
                            <button
                                className="btn btn-primary"
                                onClick={() => create.mutate({ ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId), timeSlotId: Number(form.timeSlotId) })}
                                disabled={!form.patientId || !form.doctorId || !form.timeSlotId || create.isPending}
                            >
                                {create.isPending ? 'Сохранение...' : 'Записать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}