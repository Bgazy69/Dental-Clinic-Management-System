import { useNavigate } from 'react-router-dom'
import './Landing.css'

const services = [
  { icon: '🦷', title: 'Терапия', desc: 'Лечение кариеса, пульпита и других заболеваний зубов' },
  { icon: '✨', title: 'Отбеливание', desc: 'Профессиональное отбеливание зубов до 8 тонов' },
  { icon: '🔧', title: 'Ортодонтия', desc: 'Брекеты, элайнеры, исправление прикуса' },
  { icon: '🦴', title: 'Имплантация', desc: 'Современные импланты с гарантией 10 лет' },
  { icon: '🧹', title: 'Гигиена', desc: 'Профессиональная чистка и полировка зубов' },
  { icon: '👶', title: 'Детская', desc: 'Бережное лечение зубов для детей от 3 лет' },
]

const doctors = [
  { name: 'Алия Сейткали', spec: 'Главный терапевт', exp: '12 лет опыта', emoji: '👩‍⚕️' },
  { name: 'Даурен Ахметов', spec: 'Хирург-имплантолог', exp: '8 лет опыта', emoji: '👨‍⚕️' },
  { name: 'Зарина Нурова', spec: 'Ортодонт', exp: '10 лет опыта', emoji: '👩‍⚕️' },
]

export default function Landing() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="landing">
      {/* Навбар */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo">🦷 DentalClinic</div>
          <div className="land-nav-links">
            <a href="#services">Услуги</a>
            <a href="#doctors">Врачи</a>
            <a href="#contacts">Контакты</a>
            {user.role ? (
              <button className="btn-land-outline" onClick={() => navigate('/go')}>Мой кабинет</button>
            ) : (
              <button className="btn-land-outline" onClick={() => navigate('/login')}>Войти</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🏆 Клиника №1 в городе</div>
          <h1>Здоровая улыбка — это просто</h1>
          <p>Современное оборудование, опытные врачи и комфортная атмосфера. Записывайтесь онлайн за 2 минуты.</p>
          <div className="hero-btns">
            <button className="btn-land-primary" onClick={() => navigate('/register')}>
              Записаться онлайн
            </button>
            <a href="#services" className="btn-land-ghost">Наши услуги →</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>5000+</strong><span>пациентов</span></div>
            <div className="hero-stat"><strong>15 лет</strong><span>на рынке</span></div>
            <div className="hero-stat"><strong>20+</strong><span>врачей</span></div>
            <div className="hero-stat"><strong>98%</strong><span>довольных</span></div>
          </div>
        </div>
        <div className="hero-img">
          <div className="hero-card">
            <div style={{ fontSize: 80 }}>🦷</div>
            <p>Современная стоматология</p>
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="section" id="services">
        <div className="section-inner">
          <div className="section-header">
            <h2>Наши услуги</h2>
            <p>Полный спектр стоматологической помощи для всей семьи</p>
          </div>
          <div className="services-grid">
            {services.map(s => (
              <div className="service-card" key={s.title}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Врачи */}
      <section className="section section-gray" id="doctors">
        <div className="section-inner">
          <div className="section-header">
            <h2>Наши врачи</h2>
            <p>Профессионалы с многолетним опытом работы</p>
          </div>
          <div className="doctors-grid">
            {doctors.map(d => (
              <div className="doctor-card" key={d.name}>
                <div className="doctor-emoji">{d.emoji}</div>
                <h3>{d.name}</h3>
                <p className="doctor-spec">{d.spec}</p>
                <p className="doctor-exp">{d.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Готовы к здоровой улыбке?</h2>
          <p>Запишитесь прямо сейчас и получите бесплатную консультацию</p>
          <button className="btn-land-primary btn-large" onClick={() => navigate('/register')}>
            Записаться бесплатно
          </button>
        </div>
      </section>

      {/* Контакты */}
      <section className="section" id="contacts">
        <div className="section-inner">
          <div className="contacts-grid">
            <div>
              <h2>Контакты</h2>
              <div className="contact-item">📍 г. Алматы, ул. Абая 10</div>
              <div className="contact-item">📞 +7 (727) 123-45-67</div>
              <div className="contact-item">✉️ info@dentalclinic.kz</div>
              <div className="contact-item">🕐 Пн-Сб: 9:00 — 20:00</div>
            </div>
            <div>
              <h2>Запись онлайн</h2>
              <p style={{ color: '#718096', marginBottom: 16 }}>Зарегистрируйтесь и запишитесь к нужному врачу в удобное время</p>
              <button className="btn-land-primary" onClick={() => navigate('/register')}>
                Создать аккаунт →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 DentalClinic. Все права защищены.</p>
      </footer>
    </div>
  )
}