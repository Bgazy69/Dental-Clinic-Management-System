import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'
import { UserRound, UserPlus, Trash2, Mail, Phone, Award, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
        <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 className="page-title" style={{ margin: 0 }}>Врачи</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>
                    <UserPlus size={18} /> Добавить специалиста
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {doctors.map((d, i) => (
                    <motion.div 
                        key={d.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card"
                        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${d.user?.name}&background=random`} 
                                    style={{ width: 56, height: 56, borderRadius: 16, border: '3px solid var(--border)' }} 
                                    alt="doctor" 
                                />
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{d.user?.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}>
                                        <Award size={14} /> {d.specialty}
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-outline" style={{ padding: 6, color: '#ef4444' }} onClick={() => {
                                if (confirm('Удалить запись врача?')) remove.mutate(d.id)
                            }}>
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div style={{ padding: '16px', background: 'var(--background)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                <Mail size={14} style={{ color: 'var(--text-muted)' }} /> {d.user?.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                                <Phone size={14} style={{ color: 'var(--text-muted)' }} /> {d.user?.phone || 'Телефон не указан'}
                            </div>
                        </div>

                        <p style={{ fontSize: 13, color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {d.bio || 'Биография специалиста пока не добавлена.'}
                        </p>

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                                <Star size={14} fill="#f59e0b" />
                                <span style={{ fontSize: 13, fontWeight: 700 }}>4.9</span>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(24 отзыва)</span>
                            </div>
                            <button className="btn btn-outline btn-sm">Детали</button>
                        </div>
                    </motion.div>
                ))}
                
                {doctors.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 64 }} className="card glass">
                        <UserRound size={64} style={{ marginBottom: 16, opacity: 0.1 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Врачи не добавлены</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {modal && (
                    <div className="modal-overlay" onClick={() => setModal(false)}>
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="modal" 
                            onClick={e => e.stopPropagation()}
                            style={{ width: 520 }}
                        >
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Новый специалист</h2>
                            <div className="form-group">
                                <label>Полное имя</label>
                                <input placeholder="Д-р Иванов Иван" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="doctor@clinic.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input placeholder="+7..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Специализация</label>
                                <input placeholder="Напр: Ортодонт, Хирург-стоматолог" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Пароль</label>
                                <input type="password" placeholder="Пациент войдёт с этим паролем" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Расскажите о враче</label>
                                <textarea 
                                    className="search-input" 
                                    style={{ width: '100%', height: 100, border: '1px solid var(--border)', borderRadius: 8, padding: 12, backgroundColor: 'transparent' }} 
                                    value={form.bio} 
                                    onChange={e => setForm({ ...form, bio: e.target.value })} 
                                />
                            </div>
                            <div className="modal-actions" style={{ marginTop: 24 }}>
                                <button className="btn btn-outline" onClick={() => setModal(false)}>Отмена</button>
                                <button className="btn btn-primary" onClick={() => create.mutate(form)} disabled={create.isPending}>
                                    {create.isPending ? 'Загрузка...' : 'Добавить врача'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}