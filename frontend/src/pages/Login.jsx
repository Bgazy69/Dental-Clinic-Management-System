import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { motion } from 'framer-motion'
import { Stethoscope, Mail, Lock, LogIn, ChevronLeft } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            const role = res.data.user.role
            if (role === 'ADMIN') navigate('/admin')
            else if (role === 'DOCTOR') navigate('/doctor')
            else navigate('/patient')
        } catch {
            setError('Неверный email или пароль')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page" style={{ 
            height: '100vh', 
            background: 'var(--background-soft)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.05), transparent), radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.05), transparent)'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card animate-in" 
                style={{ width: 420, padding: '48px 40px', borderRadius: 32, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div className="logo-icon-box" style={{ padding: 12, borderRadius: 16, background: 'var(--primary)', color: 'white', display: 'flex' }}>
                            <Stethoscope size={32} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)' }}>С возвращением!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>Войдите в свой личный кабинет</p>
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
                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>E-mail</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                            <input 
                                className="search-input"
                                style={{ width: '100%', height: 50, paddingLeft: 44, borderRadius: 14, border: '1px solid var(--border)', background: 'transparent', fontSize: 15 }}
                                type="email" 
                                placeholder="example@mail.com"
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 32 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>Пароль</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                            <input 
                                className="search-input"
                                style={{ width: '100%', height: 50, paddingLeft: 44, borderRadius: 14, border: '1px solid var(--border)', background: 'transparent', fontSize: 15 }}
                                type="password" 
                                placeholder="••••••••"
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', height: 54, borderRadius: 14, fontSize: 16, fontWeight: 700 }} disabled={loading}>
                        {loading ? 'Вход...' : <><LogIn size={20} style={{ marginRight: 10 }} /> Войти в систему</>}
                    </button>
                </form>

                <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Еще нет аккаунта? </span>
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                        Зарегистрироваться
                    </Link>
                </div>

                <div style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>
                        <ChevronLeft size={16} style={{ marginRight: 4 }} /> Вернуться на главную
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}