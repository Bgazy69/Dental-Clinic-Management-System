import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import { Search, UserPlus, Trash2, Mail, Phone, MapPin, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Пациенты</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>
                    <UserPlus size={18} /> Добавить пациента
                </button>
            </div>

            <div className="card" style={{ marginBottom: 24, padding: '12px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Search size={20} style={{ color: 'var(--text-muted)' }} />
                    <input
                        className="search-input"
                        placeholder="Поиск по имени, email или телефону..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: '12px 0', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Контактная информация</th>
                                <th>Записей</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p, i) => (
                                <motion.tr 
                                    key={p.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src={`https://ui-avatars.com/api/?name=${p.user?.name}&background=random`} style={{ width: 32, height: 32, borderRadius: '50%' }} alt="avatar" />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{p.user?.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <MapPin size={10} /> {p.address || 'Адрес не указан'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Mail size={12} style={{ color: 'var(--text-muted)' }} /> {p.user?.email}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Phone size={12} style={{ color: 'var(--text-muted)' }} /> {p.user?.phone || '—'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-scheduled" style={{ background: 'var(--border)', color: 'var(--text)' }}>
                                            {p.appointments?.length || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-outline" style={{ padding: 6 }}><MoreHorizontal size={14} /></button>
                                            <button className="btn btn-outline" style={{ padding: 6, color: '#ef4444' }} onClick={() => {
                                                if (confirm('Удалить пациента?')) remove.mutate(p.id)
                                            }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {patients.length === 0 && (
                                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 48 }}>Пациентов не найдено</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay" onClick={() => setModal(false)}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal" 
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Регистрация пациента</h2>
                            <div className="form-group">
                                <label>ФИО Пациента</label>
                                <input placeholder="Иван Иванов" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="patient@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input placeholder="+7..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Пароль для входа</label>
                                <input type="password" placeholder="Мин. 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Домашний адрес</label>
                                <input placeholder="Город, улица, дом" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                            </div>
                            <div className="modal-actions" style={{ marginTop: 32 }}>
                                <button className="btn btn-outline" onClick={() => setModal(false)}>Отмена</button>
                                <button className="btn btn-primary" onClick={() => create.mutate(form)} disabled={create.isPending}>
                                    {create.isPending ? 'Загрузка...' : 'Зарегистрировать'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}