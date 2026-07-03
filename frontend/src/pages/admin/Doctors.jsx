import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function Doctors() {
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', specialty: '', bio: '' })
    const qc = useQueryClient()

    const { data: doctors = [] } = useQuery({
        queryKey: ['doctors'],
        queryFn: () => api.get('/doctors').then(r => r.data)
    })

    const create = useMutation({
        mutationFn: (data) => api.post('/doctors', data),
        onSuccess: () => {
            qc.invalidateQueries(['doctors'])
            setModal(false)
            setForm({ name: '', email: '', password: '', phone: '', specialty: '', bio: '' })
        },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка')
    })

    const remove = useMutation({
        mutationFn: (id) => api.delete(`/doctors/${id}`),
        onSuccess: () => qc.invalidateQueries(['doctors'])
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Врачи</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>+ Добавить врача</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr><th>Имя</th><th>Email</th><th>Специальность</th><th>Телефон</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                        {doctors.map(d => (
                            <tr key={d.id}>
                                <td>{d.user?.name}</td>
                                <td>{d.user?.email}</td>
                                <td>{d.specialty}</td>
                                <td>{d.user?.phone || '—'}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => {
                                        if (confirm('Удалить врача?')) remove.mutate(d.id)
                                    }}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        {doctors.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', color: '#718096', padding: 32 }}>Врачи не добавлены</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Новый врач</h2>
                        <div className="form-group">
                            <label>Имя *</label>
                            <input placeholder="Иван Иванов" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" placeholder="doctor@clinic.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Пароль *</label>
                            <input type="password" placeholder="Минимум 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Телефон</label>
                            <input placeholder="+77001234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Специальность *</label>
                            <input placeholder="Терапевт, Хирург..." value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>О враче</label>
                            <input placeholder="Краткое описание" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn" onClick={() => setModal(false)}>Отмена</button>
                            <button className="btn btn-primary" onClick={() => create.mutate(form)} disabled={create.isPending}>
                                {create.isPending ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}