import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const menus = {
    ADMIN: [
        { to: '/admin', label: 'Дашборд', icon: '📊', end: true },
        { to: '/admin/patients', label: 'Пациенты', icon: '👥' },
        { to: '/admin/doctors', label: 'Врачи', icon: '👨‍⚕️' },
        { to: '/admin/appointments', label: 'Записи', icon: '📅' },
    ],
    PATIENT: [
        { to: '/patient', label: 'Главная', icon: '🏠', end: true },
        { to: '/patient/appointments', label: 'Записаться', icon: '📅' },
        { to: '/patient/history', label: 'История', icon: '📋' },
        { to: '/patient/profile', label: 'Профиль', icon: '👤' },
    ],
    DOCTOR: [
        { to: '/doctor', label: 'Сегодня', icon: '📊', end: true },
        { to: '/doctor/schedule', label: 'Расписание', icon: '📅' },
        { to: '/doctor/patients', label: 'Пациенты', icon: '👥' },
    ]
}

const roleLabel = { ADMIN: 'Администратор', DOCTOR: 'Врач', PATIENT: 'Пациент' }

export default function Layout({ role }) {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <div>
            <aside className="sidebar">
                <div className="sidebar-logo">🦷 Dental<span>Clinic</span></div>
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
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 2 }}>{roleLabel[role]}</div>
                    <div style={{ color: 'white', fontSize: 13, marginBottom: 12 }}>{user.name}</div>
                    <button className="nav-link" onClick={logout}>
                        <span className="nav-icon">🚪</span> Выйти
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}