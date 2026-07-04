const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

exports.sendAppointmentConfirmation = async ({ to, patientName, doctorName, date }) => {
    try {
        await transporter.sendMail({
            from: `"🦷 DentalClinic" <${process.env.SMTP_USER}>`,
            to,
            subject: '✅ Запись к врачу подтверждена',
            html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1a365d; font-size: 24px;">🦷 DentalClinic</h1>
          </div>
          <p style="font-size: 16px;">Здравствуйте, <strong>${patientName}</strong>!</p>
          <p style="color: #4a5568;">Ваша запись успешно подтверждена:</p>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 8px;"><strong>👨‍⚕️ Врач:</strong> ${doctorName}</p>
            <p style="margin: 0;"><strong>📅 Дата и время:</strong> ${new Date(date).toLocaleString('ru', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
          <p style="color: #4a5568;">Пожалуйста, приходите за 10 минут до приёма.</p>
          <p style="color: #4a5568;">Если хотите отменить запись — войдите в личный кабинет.</p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #718096; font-size: 13px;">🦷 DentalClinic — ваша улыбка, наша забота</p>
          </div>
        </div>
      `
        })
        console.log(`✅ Email отправлен на ${to}`)
        return true
    } catch (e) {
        console.error(`❌ Ошибка отправки email:`, e.message)
        return false
    }
}

exports.sendWelcomeEmail = async ({ to, name }) => {
    try {
        await transporter.sendMail({
            from: `"🦷 DentalClinic" <${process.env.SMTP_USER}>`,
            to,
            subject: '👋 Добро пожаловать в DentalClinic!',
            html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1a365d;">🦷 DentalClinic</h1>
          </div>
          <p style="font-size: 16px;">Здравствуйте, <strong>${name}</strong>!</p>
          <p style="color: #4a5568;">Вы успешно зарегистрировались в системе DentalClinic.</p>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px;">✅ Теперь вы можете:</p>
            <p style="margin: 4px 0;">• Записываться к врачу онлайн</p>
            <p style="margin: 4px 0;">• Просматривать историю визитов</p>
            <p style="margin: 4px 0;">• Получать напоминания о приёме</p>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="http://localhost:3000/patient" style="background: #3182ce; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Войти в личный кабинет
            </a>
          </div>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #718096; font-size: 13px;">🦷 DentalClinic — ваша улыбка, наша забота</p>
          </div>
        </div>
      `
        })
        console.log(`✅ Приветственный email отправлен на ${to}`)
        return true
    } catch (e) {
        console.error(`❌ Ошибка:`, e.message)
        return false
    }
}