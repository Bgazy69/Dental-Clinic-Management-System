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
  { name: 'Алия Сейткали', spec: 'Главный терапевт', exp: '12 лет опыта', emoji: '👩‍⚕️', patients: '2400+' },
  { name: 'Даурен Ахметов', spec: 'Хирург-имплантолог', exp: '8 лет опыта', emoji: '👨‍⚕️', patients: '1800+' },
  { name: 'Зарина Нурова', spec: 'Ортодонт', exp: '10 лет опыта', emoji: '👩‍⚕️', patients: '2100+' },
]

const reviews = [
  { name: 'Айгерим К.', text: 'Отличная клиника! Врачи внимательные, всё объяснили. Зуб вылечили быстро и безболезненно.', rating: 5 },
  { name: 'Серик М.', text: 'Поставил импланты у Даурена. Результат превзошёл ожидания. Рекомендую всем!', rating: 5 },
  { name: 'Наталья П.', text: 'Хожу сюда всей семьёй уже 3 года. Чистота, профессионализм, приятная атмосфера.', rating: 5 },
]

export default function Landing() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="landing">
      {/* Навбар */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo">
            <span className="logo-icon">🦷</span>
            <span>Dental<strong>Clinic</strong></span>
          </div>
          <div className="land-nav-links">
            <a href="#services">Услуги</a>
            <a href="#doctors">Врачи</a>
            <a href="#reviews">Отзывы</a>
            <a href="#contacts">Контакты</a>
            {user.role ? (
              <button className="btn-nav-cabinet" onClick={() => navigate('/go')}>
                Мой кабинет →
              </button>
            ) : (
              <>
                <button className="btn-nav-login" onClick={() => navigate('/login')}>Войти</button>
                <button className="btn-nav-register" onClick={() => navigate('/register')}>Записаться</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Принимаем пациентов онлайн
            </div>
            <h1>
              Ваша улыбка —<br />
              <span className="hero-accent">наша забота</span>
            </h1>
            <p>Современная стоматология с опытными врачами. Записывайтесь онлайн за 2 минуты и получите бесплатную консультацию.</p>
            <div className="hero-btns">
              <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                Записаться бесплатно
              </button>
              <a href="#services" className="btn-hero-ghost">
                Узнать больше
                <span className="arrow">↓</span>
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>5000+</strong>
                <span>пациентов</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>15 лет</strong>
                <span>на рынке</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>20+</strong>
                <span>врачей</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>98%</strong>
                <span>довольных</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-card-big">
              <div className="hero-card-top">
                <div className="hero-card-avatar">👨‍⚕️</div>
                <div>
                  <div className="hero-card-name">Даурен Ахметов</div>
                  <div className="hero-card-spec">Хирург-имплантолог</div>
                </div>
                <div className="hero-card-badge">Онлайн</div>
              </div>
              <div className="hero-card-slots">
                <div className="slots-label">Доступное время сегодня:</div>
                <div className="slots-row">
                  {['09:00', '11:30', '14:00', '16:30'].map(t => (
                    <div key={t} className="slot-chip" onClick={() => navigate('/register')}>{t}</div>
                  ))}
                </div>
              </div>
              <button className="hero-card-btn" onClick={() => navigate('/register')}>
                Записаться →
              </button>
            </div>
            <div className="hero-float-card top-right">
              <span>⭐</span>
              <div>
                <strong>4.9 / 5.0</strong>
                <span>Рейтинг клиники</span>
              </div>
            </div>
            <div className="hero-float-card bottom-left">
              <span>✅</span>
              <div>
                <strong>Без боли</strong>
                <span>Современная анестезия</span>
              </div>
            </div>
          </div>
        </div>

        {/* Волна */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Почему мы */}
      <section className="why-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Наши преимущества</div>
            <h2>Почему выбирают нас</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: '🏆', title: 'Опытные врачи', desc: 'Все специалисты с опытом от 8 лет и международными сертификатами' },
              { icon: '💉', title: 'Без боли', desc: 'Современные методы анестезии — лечение комфортно и безопасно' },
              { icon: '🔬', title: 'Оборудование', desc: 'Цифровой рентген, 3D-томография и современные материалы' },
              { icon: '📱', title: 'Онлайн запись', desc: 'Записывайтесь в любое время через сайт без звонков' },
            ].map(w => (
              <div className="why-card" key={w.title}>
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="section section-gray" id="services">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Что мы лечим</div>
            <h2>Наши услуги</h2>
            <p>Полный спектр стоматологической помощи для всей семьи</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card" key={s.title}>
                <div className="service-num">0{i + 1}</div>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Врачи */}
      <section className="section" id="doctors">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Команда</div>
            <h2>Наши врачи</h2>
            <p>Профессионалы с многолетним опытом работы</p>
          </div>
          <div className="doctors-grid">
            {doctors.map(d => (
              <div className="doctor-card" key={d.name}>
                <div className="doctor-avatar">{d.emoji}</div>
                <div className="doctor-info">
                  <h3>{d.name}</h3>
                  <p className="doctor-spec">{d.spec}</p>
                  <div className="doctor-meta">
                    <span>🏅 {d.exp}</span>
                    <span>👥 {d.patients} пациентов</span>
                  </div>
                </div>
                <button className="doctor-btn" onClick={() => navigate('/register')}>
                  Записаться
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="section section-gray" id="reviews">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Отзывы</div>
            <h2>Что говорят пациенты</h2>
          </div>
          <div className="reviews-grid">
            {reviews.map(r => (
              <div className="review-card" key={r.name}>
                <div className="review-stars">{'⭐'.repeat(r.rating)}</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <strong>{r.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-badge">🎁 Первый визит бесплатно</div>
          <h2>Готовы к здоровой улыбке?</h2>
          <p>Запишитесь прямо сейчас и получите бесплатную консультацию врача</p>
          <div className="cta-btns">
            <button className="btn-cta-primary" onClick={() => navigate('/register')}>
              Записаться бесплатно
            </button>
            <a href="tel:+77271234567" className="btn-cta-ghost">
              📞 +7 (727) 123-45-67
            </a>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="section" id="contacts">
        <div className="section-inner">
          <div className="contacts-grid">
            <div className="contacts-info">
              <div className="section-tag">Контакты</div>
              <h2>Как нас найти</h2>
              <div className="contact-list">
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <strong>Адрес</strong>
                    <span>г. Алматы, ул. Абая 10</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div>
                    <strong>Телефон</strong>
                    <span>+7 (727) 123-45-67</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <strong>Email</strong>
                    <span>info@dentalclinic.kz</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🕐</div>
                  <div>
                    <strong>Режим работы</strong>
                    <span>Пн–Сб: 9:00 — 20:00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="contacts-form">
              <h3>Запись онлайн</h3>
              <p>Зарегистрируйтесь и запишитесь к нужному врачу в удобное время — без очередей и звонков</p>
              <button className="btn-hero-primary" style={{ marginTop: 24 }} onClick={() => navigate('/register')}>
                Создать аккаунт →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">🦷 DentalClinic</div>
          <p>© 2026 DentalClinic. Все права защищены.</p>
          <div className="footer-links">
            <a href="#services">Услуги</a>
            <a href="#doctors">Врачи</a>
            <a href="#contacts">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  )
}