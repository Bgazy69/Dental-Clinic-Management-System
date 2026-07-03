import { useState, useEffect } from 'react'
import api from '../../api'

export default function PatientProfile() {
    const [user, setUser] = useState({})
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        api.get('/auth/me').then(r => setUser(r.data))
    }, [])

    const save = async () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div>
            <h1 className="page-title">Мой профиль</h1>
            <div className="card" style={{ maxWidth: 520 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#bee3f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                        👤
                    </div>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a365d' }}>{user.name}</h2>
                        <span style={{ background: '#bee3f8', color: '#2b6cb0', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Пациент</span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Имя</label>
                    <input value={user.name || ''} onChange={e => setUser({ ...user, name: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input value={user.email || ''} disabled style={{ background: '#f7fafc', color: '#718096' }} />
                </div>
                <div className="form-group">
                    <label>Телефон</label>
                    <input value={user.phone || ''} onChange={e => setUser({ ...user, phone: e.target.value })} placeholder="+77001234567" />
                </div>
                <button className="btn btn-primary" onClick={save} style={{ marginTop: 8 }}>
                    {saved ? '✓ Сохранено!' : 'Сохранить'}
                </button>
            </div>
        </div>
    )
}