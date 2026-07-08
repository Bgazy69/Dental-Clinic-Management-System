import { useNavigate } from 'react-router-dom'
import './Landing.css'
import { motion } from 'framer-motion'
import { 
  Stethoscope, 
  Sparkles, 
  Wrench, 
  Dna, 
  Wind, 
  Baby, 
  CheckCircle2, 
  Star, 
  Award, 
  Clock, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Plus
} from 'lucide-react'

const services = [
  { icon: <Stethoscope size={28} />, title: 'Терапия', desc: 'Лечение кариеса, пульпита и других заболеваний зубов' },
  { icon: <Sparkles size={28} />, title: 'Отбеливание', desc: 'Профессиональное отбеливание зубов до 8 тонов' },
  { icon: <Wrench size={28} />, title: 'Ортодонтия', desc: 'Брекеты, элайнеры, исправление прикуса' },
  { icon: <Dna size={28} />, title: 'Имплантация', desc: 'Современные импланты с гарантией 10 лет' },
  { icon: <Wind size={28} />, title: 'Гигиена', desc: 'Профессиональная чистка и полировка зубов' },
  { icon: <Baby size={28} />, title: 'Детская', desc: 'Бережное лечение зубов для детей от 3 лет' },
]

const doctors = [
  { name: 'Алия Сейткали', spec: 'Главный терапевт', exp: '12 лет опыта', patients: '2400+', image: 'https://ui-avatars.com/api/?name=Alia+Seitkali&background=3b82f6&color=fff' },
  { name: 'Даурен Ахметов', spec: 'Хирург-имплантолог', exp: '8 лет опыта', patients: '1800+', image: 'https://ui-avatars.com/api/?name=Dauren+Akhmetov&background=10b981&color=fff' },
  { name: 'Зарина Нурова', spec: 'Ортодонт', exp: '10 лет опыта', patients: '2100+', image: 'https://ui-avatars.com/api/?name=Zarina+Nurova&background=8b5cf6&color=fff' },
]

const reviews = [
  { name: 'Айгерим К.', text: 'Отличная клиника! Врачи внимательные, всё объяснили. Зуб вылечили быстро и безболезненно.', rating: 5 },
  { name: 'Серик М.', text: 'Поставил импланты у Даурена. Результат превзошёл ожидания. Рекомендую всем!', rating: 5 },
  { name: 'Наталья П.', text: 'Хожу сюда всей семьёй уже 3 года. Чистота, профессионализм, приятная атмосфера.', rating: 5 },
]

export default function Landing() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="landing">
      {/* Навбар */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon-box" style={{ background: 'var(--primary)', padding: 8, borderRadius: 10, display: 'flex' }}>
              <Stethoscope size={24} color="white" />
            </div>
            <span>Dental<strong>Clinic</strong></span>
          </div>
          <div className="land-nav-links">
            <a href="#services">Услуги</a>
            <a href="#doctors">Врачи</a>
            <a href="#reviews">Отзывы</a>
            <a href="#contacts">Контакты</a>
            {user.role ? (
              <button className="btn-nav-cabinet" onClick={() => navigate('/go')}>
                Мой кабинет <ChevronRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-nav-login" onClick={() => navigate('/login')}>Войти</button>
                <button className="btn-nav-register" onClick={() => navigate('/register')}>Записаться</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Принимаем пациентов онлайн
            </div>
            <h1>
              Ваша улыбка —<br />
              <span className="hero-accent">наша забота</span>
            </h1>
            <p>Премиальная стоматология в центре Алматы. Записывайтесь онлайн и получите бесплатную диагностику при первом посещении.</p>
            <div className="hero-btns">
              <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                Записаться онлайн
              </button>
              <a href="#services" className="btn-hero-ghost">
                Наши услуги
                <Clock size={18} style={{ marginLeft: 8 }} />
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
                <span>опыта</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>20+</strong>
                <span>врачей</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-card-big glass">
              <div className="hero-card-top">
                <img src="https://ui-avatars.com/api/?name=Dauren+Akhmetov&background=3b82f6&color=fff" className="hero-card-img" alt="doc" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div>
                  <div className="hero-card-name">Даурен Ахметов</div>
                  <div className="hero-card-spec">Хирург-имплантолог</div>
                </div>
                <div className="hero-card-badge">Online</div>
              </div>
              <div className="hero-card-slots">
                <div className="slots-label">Доступно сегодня:</div>
                <div className="slots-row">
                  {['09:00', '11:30', '14:00', '16:30'].map(t => (
                    <div key={t} className="slot-chip" onClick={() => navigate('/register')}>{t}</div>
                  ))}
                </div>
              </div>
              <button className="hero-card-btn" onClick={() => navigate('/register')}>
                Забронировать слот <ChevronRight size={18} />
              </button>
            </div>
            
            <motion.div 
              className="hero-float-card top-right"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
              <div>
                <strong>4.9 / 5.0</strong>
                <span>Рейтинг Google</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="hero-float-card bottom-left"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <ShieldCheck size={20} color="#10b981" />
              <div>
                <strong>Без боли</strong>
                <span>Гарантия комфорта</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Почему мы */}
      <section className="why-section">
        <div className="section-inner">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
          >
            <div className="section-tag">Преимущества</div>
            <h2>Почему доверяют нам</h2>
          </motion.div>
          <div className="why-grid">
            {[
              { icon: <Award size={32} />, title: 'Опытные врачи', desc: 'Все специалисты с опытом от 8 лет и международными сертификатами' },
              { icon: <Sparkles size={32} />, title: 'Без боли', desc: 'Современные методы анестезии — лечение комфортно и безопасно' },
              { icon: <ShieldCheck size={32} />, title: 'Оборудование', desc: 'Цифровой рентген, 3D-томография и современные материалы' },
              { icon: <Smartphone size={32} />, title: 'Онлайн запись', desc: 'Записывайтесь в любое время через сайт без звонков' },
            ].map((w, i) => (
              <motion.div 
                className="why-card" 
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="why-icon-box" style={{ background: 'rgba(37, 99, 235, 0.05)', padding: 16, borderRadius: 16, width: 'fit-content', marginBottom: 20 }}>{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="section section-gray" id="services">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Услуги</div>
            <h2>Что мы делаем идеально</h2>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <motion.div 
                className="service-card" 
                key={s.title}
                whileHover={{ y: -10 }}
              >
                <div className="service-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="service-icon-box" style={{ marginBottom: 16 }}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="section" id="doctors">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Команда</div>
            <h2>Наши специалисты</h2>
          </div>
          <div className="doctors-grid">
            {doctors.map((d, i) => (
              <motion.div 
                className="doctor-card" 
                key={d.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <img src={d.image} alt={d.name} className="doctor-img" />
                <div className="doctor-info">
                  <h3>{d.name}</h3>
                  <p className="doctor-spec">{d.spec}</p>
                  <div className="doctor-meta">
                    <div className="meta-item"><Plus size={12} /> {d.exp}</div>
                    <div className="meta-item"><CheckCircle2 size={12} /> {d.patients}</div>
                  </div>
                </div>
                <button className="doctor-btn" onClick={() => navigate('/register')}>
                  Записаться
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="section section-gray" id="reviews">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Отзывы</div>
            <h2>Истории наших пациентов</h2>
          </div>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <motion.div 
                className="review-card" 
                key={r.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Проверенный отзыв</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="cta-badge">🎁 Акция месяца</div>
            <h2>Ваша идеальная улыбка начинается здесь</h2>
            <p>Запишитесь на прием сегодня и получите профессиональную гигиену со скидкой 30%</p>
            <div className="cta-btns">
              <button className="btn-cta-primary" onClick={() => navigate('/register')}>
                Записаться сейчас
              </button>
              <a href="tel:+77271234567" className="btn-cta-ghost">
                <Phone size={18} /> +7 (727) 123-45-67
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Контакты */}
      <section className="section" id="contacts">
        <div className="section-inner">
          <div className="contacts-grid">
            <div className="contacts-info">
              <div className="section-tag">Контакты</div>
              <h2>Будем рады видеть вас</h2>
              <div className="contact-list">
                <div className="contact-item">
                  <div className="contact-icon-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={20} /></div>
                  <div>
                    <strong>Адрес</strong>
                    <span>г. Алматы, пр. Назарбаева 42</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={20} /></div>
                  <div>
                    <strong>Телефон</strong>
                    <span>+7 (727) 123-45-67</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                  <div>
                    <strong>Email</strong>
                    <span>hello@dentalclinic.kz</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="contacts-form card glass">
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Начните лечение сегодня</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Зарегистрируйтесь в личном кабинете, чтобы управлять своими визитами онлайн.</p>
              <button className="btn btn-primary" style={{ width: '100%', height: 56 }} onClick={() => navigate('/register')}>
                Завести медкарту <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <Stethoscope size={20} /> Dental<strong>Clinic</strong>
          </div>
          <p>© 2026 Стоматологический центр DentalClinic. Сделано с любовью к зубам.</p>
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