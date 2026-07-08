import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
    LayoutDashboard, Users, UserRound, Calendar, History, User, LogOut, Sun, Moon, Sparkles 
} from 'lucide-react'
import NotificationCenter from './NotificationCenter'
import { motion } from 'framer-motion'

const menus = {
    ADMIN: [
        { to: '/admin', label: 'Дашборд', icon: <LayoutDashboard size={20} />, end: true },
        { to: '/admin/patients', label: 'Пациенты', icon: <Users size={20} /> },
        { to: '/admin/doctors', label: 'Врачи', icon: <UserRound size={20} /> },
        { to: '/admin/appointments', label: 'Записи', icon: <Calendar size={20} /> },
    ],
    PATIENT: [
        { to: '/patient', label: 'Главная', icon: <LayoutDashboard size={20} />, end: true },
        { to: '/patient/appointments', label: 'Записаться', icon: <Calendar size={20} /> },
        { to: '/patient/history', label: 'История', icon: <History size={20} /> },
        { to: '/patient/profile', label: 'Профиль', icon: <User size={20} /> },
    ],
    DOCTOR: [
        { to: '/doctor', label: 'Сегодня', icon: <LayoutDashboard size={20} />, end: true },
        { to: '/doctor/schedule', label: 'Расписание', icon: <Calendar size={20} /> },
        { to: '/doctor/patients', label: 'Пациенты', icon: <Users size={20} /> },
    ]
}

const roleLabel = { ADMIN: 'Администратор', DOCTOR: 'Врач', PATIENT: 'Пациент' }

export default function Layout({ role }) {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <div className="layout-root">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Sparkles size={24} color="#60a5fa" /> Dental<span>Clinic</span>
                </div>
                <nav style={{ marginTop: 16, flex: 1 }}>
                    {(menus[role] || []).map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span> {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'rgba(148, 163, 184, 0.5)', fontSize: 11, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                        {roleLabel[role]}
                    </div>
                    <div style={{ color: 'white', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>{user.name}</div>
                    <button className="nav-link" onClick={logout} style={{ margin: 0, padding: '10px 0', width: 'auto' }}>
                        <span className="nav-icon"><LogOut size={18} /></span> Выйти
                    </button>
                </div>
            </aside>

            <header className="top-header glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button 
                        onClick={toggleTheme} 
                        className="btn btn-outline" 
                        style={{ padding: '8px', cursor: 'pointer' }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <NotificationCenter />
                    <div style={{ height: 32, width: 1, background: 'var(--border)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                            alt="avatar" 
                            style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--primary)' }}
                        />
                        <div style={{ display: 'none' }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    )
}