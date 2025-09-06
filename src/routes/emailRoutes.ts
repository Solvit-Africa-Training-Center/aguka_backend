import { Router } from 'express';
import { sendEmail } from '../utils/emailService';

const emailRouter = Router();

emailRouter.post('/send-email', async (req, res) => {
  const { email, name, message } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({ error: 'Email, name, and message are required' });
  }

  try {
    await sendEmail(email, name, message);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

export default emailRouter;
