import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'

export default function Appointments() {
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', notes: '' })
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

    const create = useMutation({
        mutationFn: (data) => api.post('/appointments', {
            ...data,
            patientId: Number(data.patientId),
            doctorId: Number(data.doctorId)
        }),
        onSuccess: () => { qc.invalidateQueries(['appointments']); setModal(false) }
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => api.put(`/appointments/${id}`, { status }),
        onSuccess: () => qc.invalidateQueries(['appointments'])
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Записи на приём</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>+ Добавить</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr><th>Пациент</th><th>Врач</th><th>Дата и время</th><th>Статус</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => (
                            <tr key={a.id}>
                                <td>{a.patient.firstName} {a.patient.lastName}</td>
                                <td>{a.doctor.name}</td>
                                <td>{new Date(a.date).toLocaleString('ru')}</td>
                                <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                                <td style={{ display: 'flex', gap: 6 }}>
                                    <button className="btn btn-success btn-sm" onClick={() => updateStatus.mutate({ id: a.id, status: 'COMPLETED' })}>✓</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus.mutate({ id: a.id, status: 'CANCELLED' })}>✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Новая запись</h2>
                        <div className="form-group">
                            <label>Пациент</label>
                            <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
                                <option value="">Выберите пациента</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Врач</label>
                            <select value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}>
                                <option value="">Выберите врача</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Дата и время</label>
                            <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Заметки</label>
                            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Необязательно" />
                        </div>
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setModal(false)}>Отмена</button>
                            <button className="btn btn-primary" onClick={() => create.mutate(form)}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}