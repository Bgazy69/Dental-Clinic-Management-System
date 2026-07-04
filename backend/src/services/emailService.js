const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'demo@clinic.com',
        pass: process.env.SMTP_PASS || 'demo'
    }
})

exports.sendAppointmentConfirmation = async ({ to, patientName, doctorName, date }) => {
    try {
        await transporter.sendMail({
            from: '"DentalClinic" <noreply@dentalclinic.kz>',
            to,
            subject: 'Подтверждение записи к врачу',
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a365d;">🦷 DentalClinic</h2>
          <p>Здравствуйте, <strong>${patientName}</strong>!</p>
          <p>Ваша запись подтверждена:</p>
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Врач:</strong> ${doctorName}</p>
            <p><strong>Дата и время:</strong> ${new Date(date).toLocaleString('ru')}</p>
          </div>
          <p>Если вы хотите отменить запись, войдите в личный кабинет.</p>
          <p style="color: #718096; font-size: 13px;">DentalClinic — ваша улыбка, наша забота</p>
        </div>
      `
        })
        console.log(`📧 Email отправлен на ${to}`)
        return true
    } catch (e) {
        console.log(`📧 Email (demo mode): к ${to} — запись у ${doctorName} на ${new Date(date).toLocaleString('ru')}`)
        return false
    }
}