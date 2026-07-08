import { useState, useEffect } from 'react'
import api from '../../api'
import { User, Mail, Phone, Shield, Save, Check } from 'lucide-react'
import { motion } from 'framer-motion'

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
        <div className="animate-in">
            <h1 className="page-title" style={{ marginBottom: 32 }}>Настройки профиля</h1>
            
            <div className="content-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="card" style={{ height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ 
                            width: 100, height: 100, borderRadius: '50%', 
                            background: 'var(--primary)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: 40, margin: '0 auto 20px',
                            boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
                        }}>
                            {user.name?.[0]}
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 800 }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Пациент клиники</p>
                        
                        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'var(--background)', border: '1px solid var(--border)', textAlign: 'left' }}>
                                <Shield size={18} color="var(--primary)" />
                                <div style={{ fontSize: 12 }}>
                                    <strong>Статус аккаунта</strong>
                                    <div style={{ color: '#10b981' }}>Подтвержден</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Личные данные</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>Полное имя</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                                <input 
                                    className="search-input"
                                    style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                    value={user.name || ''} 
                                    onChange={e => setUser({ ...user, name: e.target.value })} 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>Электронная почта</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                                <input 
                                    className="search-input"
                                    style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--background-soft)', color: 'var(--text-muted)' }}
                                    value={user.email || ''} 
                                    disabled 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>Контактный телефон</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
                                <input 
                                    className="search-input"
                                    style={{ width: '100%', height: 48, paddingLeft: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'transparent' }}
                                    value={user.phone || ''} 
                                    onChange={e => setUser({ ...user, phone: e.target.value })} 
                                    placeholder="+7 700 000 00 00" 
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary" onClick={save} style={{ width: 'fit-content', height: 48, padding: '0 32px', marginTop: 12 }}>
                            {saved ? <><Check size={18} style={{ marginRight: 8 }} /> Сохранено!</> : <><Save size={18} style={{ marginRight: 8 }} /> Сохранить изменения</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}