import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function Patients() {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' })
    const qc = useQueryClient()

    const { data: patients = [] } = useQuery({
        queryKey: ['patients', search],
        queryFn: () => api.get(`/patients?search=${search}`).then(r => r.data)
    })

    const create = useMutation({
        mutationFn: (data) => api.post('/patients', data),
        onSuccess: () => {
            qc.invalidateQueries(['patients'])
            setModal(false)
            setForm({ name: '', email: '', phone: '', password: '', address: '' })
        },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка')
    })

    const remove = useMutation({
        mutationFn: (id) => api.delete(`/patients/${id}`),
        onSuccess: () => qc.invalidateQueries(['patients'])
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Пациенты</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>+ Добавить пациента</button>
            </div>

            <div className="search-bar">
                <input
                    placeholder="Поиск по имени, email или телефону..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr><th>Имя</th><th>Телефон</th><th>Email</th><th>Записей</th><th>Действия</th></tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id}>
                                <td>{p.user?.name}</td>
                                <td>{p.user?.phone || '—'}</td>
                                <td>{p.user?.email}</td>
                                <td>{p.appointments?.length || 0}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => {
                                        if (confirm('Удалить пациента?')) remove.mutate(p.id)
                                    }}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', color: '#718096', padding: 32 }}>Пациентов нет</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Новый пациент</h2>
                        <div className="form-group">
                            <label>Имя *</label>
                            <input placeholder="Иван Иванов" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" placeholder="patient@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Телефон</label>
                            <input placeholder="+77001234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Пароль *</label>
                            <input type="password" placeholder="Пациент войдёт с этим паролем" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Адрес</label>
                            <input placeholder="Город, улица" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
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