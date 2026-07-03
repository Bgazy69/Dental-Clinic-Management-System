import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api'

export default function DoctorSchedule() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [times, setTimes] = useState([])
    const qc = useQueryClient()

    const { data: slots = [] } = useQuery({
        queryKey: ['my-slots', user.doctorId, date],
        queryFn: () => api.get(`/doctors/${user.doctorId}/slots?date=${date}`).then(r => r.data),
        enabled: !!user.doctorId
    })

    const addSlots = useMutation({
        mutationFn: () => {
            const slotDates = times.map(t => `${date}T${t}:00.000Z`)
            return api.post(`/doctors/${user.doctorId}/slots`, { slots: slotDates })
        },
        onSuccess: () => { qc.invalidateQueries(['my-slots']); setTimes([]) },
        onError: (e) => alert(e.response?.data?.error || 'Ошибка')
    })

    const presetTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

    const toggleTime = (t) => {
        setTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
    }

    return (
        <div>
            <h1 className="page-title">Моё расписание</h1>

            <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Добавить слоты</h2>
                <div className="form-group" style={{ maxWidth: 280 }}>
                    <label>Дата</label>
                    <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} />
                </div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#4a5568', display: 'block', marginBottom: 10 }}>
                    Выберите время приёма
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {presetTimes.map(t => (
                        <button key={t} onClick={() => toggleTime(t)} style={{
                            padding: '8px 16px', borderRadius: 8,
                            border: `2px solid ${times.includes(t) ? '#3182ce' : '#e2e8f0'}`,
                            background: times.includes(t) ? '#3182ce' : 'white',
                            color: times.includes(t) ? 'white' : '#1a365d',
                            cursor: 'pointer', fontWeight: 600
                        }}>{t}</button>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={() => addSlots.mutate()} disabled={times.length === 0 || addSlots.isPending}>
                    {addSlots.isPending ? 'Добавляем...' : `Добавить ${times.length} слот(а)`}
                </button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600 }}>
                        Слоты на {new Date(date + 'T00:00:00').toLocaleDateString('ru', { day: 'numeric', month: 'long' })}
                    </h2>
                </div>
                {slots.length === 0 ? (
                    <p style={{ padding: 24, color: '#718096' }}>Нет слотов на эту дату</p>
                ) : (
                    <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {slots.map(s => (
                            <div key={s.id} style={{
                                padding: '8px 16px', borderRadius: 8,
                                background: s.available ? '#c6f6d5' : '#fed7d7',
                                color: s.available ? '#276749' : '#9b2c2c',
                                fontWeight: 600, fontSize: 14
                            }}>
                                {new Date(s.date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                <span style={{ fontSize: 11, marginLeft: 6 }}>{s.available ? '✓' : '✗'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}