import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function PatientAppointments() {
    const [step, setStep] = useState(1)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [complaint, setComplaint] = useState('')
    const [done, setDone] = useState(false)
    const qc = useQueryClient()

    const { data: doctors = [] } = useQuery({
        queryKey: ['doctors'],
        queryFn: () => api.get('/doctors').then(r => r.data)
    })

    const { data: slots = [] } = useQuery({
        queryKey: ['slots', selectedDoctor?.id, selectedDate],
        queryFn: () => api.get(`/doctors/${selectedDoctor.id}/slots?date=${selectedDate}`).then(r => r.data),
        enabled: !!selectedDoctor && !!selectedDate
    })

    const book = useMutation({
        mutationFn: () => api.post('/appointments', {
            doctorId: selectedDoctor.id,
            timeSlotId: selectedSlot.id,
            complaint
        }),
        onSuccess: () => {
            qc.invalidateQueries(['slots'])
            setDone(true)
        },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка записи')
    })

    if (done) return (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>✅</div>
            <h2 style={{ fontSize: 28, color: '#1a365d', marginBottom: 12 }}>Вы записаны!</h2>
            <p style={{ color: '#718096', marginBottom: 8 }}>Врач: <strong>{selectedDoctor?.user?.name}</strong></p>
            <p style={{ color: '#718096', marginBottom: 32 }}>Время: <strong>{new Date(selectedSlot?.date).toLocaleString('ru')}</strong></p>
            <button className="btn btn-primary" onClick={() => { setDone(false); setStep(1); setSelectedDoctor(null); setSelectedDate(''); setSelectedSlot(null); setComplaint('') }}>
                Записаться ещё раз
            </button>
        </div>
    )

    return (
        <div>
            <h1 className="page-title">Запись к врачу</h1>

            {/* Шаги */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
                {['Выбор врача', 'Дата и время', 'Подтверждение'].map((s, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: step > i ? '#3182ce' : step === i + 1 ? '#3182ce' : '#e2e8f0',
                            color: step >= i + 1 ? 'white' : '#718096', fontWeight: 700, fontSize: 14, flexShrink: 0
                        }}>{i + 1}</div>
                        <span style={{ marginLeft: 8, fontSize: 14, color: step === i + 1 ? '#1a365d' : '#718096', fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                        {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#3182ce' : '#e2e8f0', margin: '0 12px' }} />}
                    </div>
                ))}
            </div>

            {/* Шаг 1 — выбор врача */}
            {step === 1 && (
                <div>
                    <h2 style={{ fontSize: 18, marginBottom: 20, color: '#1a365d' }}>Выберите врача</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {doctors.map(d => (
                            <div key={d.id} onClick={() => { setSelectedDoctor(d); setStep(2) }}
                                style={{
                                    background: 'white', borderRadius: 12, padding: 24, cursor: 'pointer',
                                    border: `2px solid ${selectedDoctor?.id === d.id ? '#3182ce' : '#e2e8f0'}`,
                                    transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#3182ce'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = selectedDoctor?.id === d.id ? '#3182ce' : '#e2e8f0'}
                            >
                                <div style={{ fontSize: 40, marginBottom: 12 }}>👨‍⚕️</div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a365d', marginBottom: 4 }}>{d.user?.name}</h3>
                                <p style={{ color: '#3182ce', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{d.specialty}</p>
                                {d.bio && <p style={{ color: '#718096', fontSize: 13 }}>{d.bio}</p>}
                            </div>
                        ))}
                        {doctors.length === 0 && <p style={{ color: '#718096' }}>Врачи ещё не добавлены</p>}
                    </div>
                </div>
            )}

            {/* Шаг 2 — дата и время */}
            {step === 2 && (
                <div>
                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', marginBottom: 20, fontSize: 14 }}>← Назад</button>
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 16, marginBottom: 4 }}>Выбранный врач</h3>
                        <p style={{ color: '#1a365d', fontWeight: 600 }}>{selectedDoctor?.user?.name}</p>
                        <p style={{ color: '#718096', fontSize: 13 }}>{selectedDoctor?.specialty}</p>
                    </div>
                    <h2 style={{ fontSize: 18, marginBottom: 16, color: '#1a365d' }}>Выберите дату</h2>
                    <div className="form-group" style={{ maxWidth: 280 }}>
                        <input type="date" value={selectedDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null) }}
                        />
                    </div>
                    {selectedDate && (
                        <>
                            <h2 style={{ fontSize: 18, margin: '24px 0 16px', color: '#1a365d' }}>Доступное время</h2>
                            {slots.length === 0 ? (
                                <p style={{ color: '#e53e3e' }}>На эту дату нет доступных слотов. Выберите другой день.</p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                                    {slots.map(s => (
                                        <button key={s.id} onClick={() => setSelectedSlot(s)}
                                            style={{
                                                padding: '10px 20px', borderRadius: 8, border: `2px solid ${selectedSlot?.id === s.id ? '#3182ce' : '#e2e8f0'}`,
                                                background: selectedSlot?.id === s.id ? '#3182ce' : 'white',
                                                color: selectedSlot?.id === s.id ? 'white' : '#1a365d',
                                                cursor: 'pointer', fontWeight: 600, fontSize: 15
                                            }}
                                        >
                                            {new Date(s.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {selectedSlot && (
                                <button className="btn btn-primary" onClick={() => setStep(3)}>Далее →</button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Шаг 3 — подтверждение */}
            {step === 3 && (
                <div style={{ maxWidth: 480 }}>
                    <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', marginBottom: 20, fontSize: 14 }}>← Назад</button>
                    <h2 style={{ fontSize: 18, marginBottom: 20, color: '#1a365d' }}>Подтверждение записи</h2>
                    <div className="card" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#718096' }}>Врач</span>
                                <span style={{ fontWeight: 600 }}>{selectedDoctor?.user?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#718096' }}>Специальность</span>
                                <span>{selectedDoctor?.specialty}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#718096' }}>Дата и время</span>
                                <span style={{ fontWeight: 600 }}>{new Date(selectedSlot?.date).toLocaleString('ru')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Опишите жалобу (необязательно)</label>
                        <input placeholder="Например: болит зуб справа снизу..." value={complaint} onChange={e => setComplaint(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }}
                        onClick={() => book.mutate()} disabled={book.isPending}>
                        {book.isPending ? 'Записываем...' : '✓ Подтвердить запись'}
                    </button>
                </div>
            )}
        </div>
    )
}