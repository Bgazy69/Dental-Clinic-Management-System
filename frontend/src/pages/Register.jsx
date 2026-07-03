import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

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
        <div className="login-page">
            <div className="login-card" style={{ width: 440 }}>
                <h1>🦷 DentalClinic</h1>
                <p>Создайте аккаунт пациента</p>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ваше имя *</label>
                        <input placeholder="Иван Иванов" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Телефон</label>
                        <input placeholder="+77001234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Пароль *</label>
                        <input type="password" placeholder="Минимум 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Повторите пароль *</label>
                        <input type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#718096' }}>
                    Уже есть аккаунт? <Link to="/login" style={{ color: '#3182ce' }}>Войти</Link>
                </p>
            </div>
        </div>
    )
}