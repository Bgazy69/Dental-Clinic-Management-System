import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { motion } from 'framer-motion'
import { Stethoscope, User, Mail, Phone, Lock, UserPlus, ChevronLeft } from 'lucide-react'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirm) return setError('Пароли не совпадают')
        if (form.password.length < 6) return setError('Пароль минимум 6 символов')
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/auth/register', {
                name: form.name, email: form.email, phone: form.phone, password: form.password
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/patient')
        } catch (e) {
            setError(e.response?.data?.error || 'Ошибка регистрации')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page" style={{ 
            minHeight: '100vh', 
            background: 'var(--background-soft)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px 20px',
            background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.05), transparent), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.05), transparent)'
        }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card animate-in" 
                style={{ width: 460, padding: '48px 40px', borderRadius: 32, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div className="logo-icon-box" style={{ padding: 12, borderRadius: 16, background: 'var(--primary)', color: 'white', display: 'flex' }}>
                            <Stethoscope size={32} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>Регистрация</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>Создайте личный кабинет пациента</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: 12, fontSize: 13, marginBottom: 24, textAlign: 'center', fontWeight: 600 }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6, display: 'block' }}>ФИО *</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                            <input 
                                className="search-input"
                                style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                placeholder="Иван Иванов" 
                                value={form.name} 
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6, display: 'block' }}>E-mail *</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                            <input 
                                className="search-input"
                                style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                type="email" 
                                placeholder="your@email.com" 
                                value={form.email} 
                                onChange={e => setForm({ ...form, email: e.target.value })} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6, display: 'block' }}>Телефон</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                            <input 
                                className="search-input"
                                style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                placeholder="+7 700 000 00 00" 
                                value={form.phone} 
                                onChange={e => setForm({ ...form, phone: e.target.value })} 
                            />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6, display: 'block' }}>Пароль *</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                                <input 
                                    className="search-input"
                                    style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                    type="password" 
                                    placeholder="••••••" 
                                    value={form.password} 
                                    onChange={e => setForm({ ...form, password: e.target.value })} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 6, display: 'block' }}>Повтор *</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                                <input 
                                    className="search-input"
                                    style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                    type="password" 
                                    placeholder="••••••" 
                                    value={form.confirm} 
                                    onChange={e => setForm({ ...form, confirm: e.target.value })} 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', height: 54, borderRadius: 14, fontSize: 16, fontWeight: 700 }} disabled={loading}>
                        {loading ? 'Регистрация...' : <><UserPlus size={20} style={{ marginRight: 10 }} /> Создать аккаунт</>}
                    </button>
                </form>

                <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Уже есть аккаунт? </span>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                        Войти
                    </Link>
                </div>

                <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>
                        <ChevronLeft size={16} style={{ marginRight: 4 }} /> Вернуться на главную
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}