import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return (
        <div>
            <aside className="sidebar">
                <div className="sidebar-logo">🦷 Dental<span>Clinic</span></div>
                <nav style={{ marginTop: 16, flex: 1 }}>
                    <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📊</span> Дашборд
                    </NavLink>
                    <NavLink to="/patients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">👥</span> Пациенты
                    </NavLink>
                    <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">👨‍⚕️</span> Врачи
                    </NavLink>
                    <NavLink to="/appointments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📅</span> Записи
                    </NavLink>
                </nav>
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8 }}>
                        {user.name} ({user.role})
                    </div>
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