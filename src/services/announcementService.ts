import { Announcement } from '../database/models/announcementModel';
import { User } from '../database/models/userModel';
import { sendEmail } from '../utils/emailService';

class AnnouncementService {
  static async createAnnouncement(data: {
    title: string;
    authorId: string;
    groupId: string;
    meetingDate: string | Date;
    meetingTime: string;
    location: string;
    agenda: string;
  }) {
    const announcement = await Announcement.create({
      ...data,
      meetingDate: new Date(data.meetingDate),
      status: 'scheduled',
    });

    const members = await User.findAll({ where: { groupId: data.groupId } });

    const message = `
      <p>Hello,</p>
      <p>A new meeting has been scheduled:</p>
      <ul>
        <li><b>Title:</b> ${data.title}</li>
        <li><b>Date:</b> ${data.meetingDate}</li>
        <li><b>Time:</b> ${data.meetingTime}</li>
        <li><b>Location:</b> ${data.location}</li>
        <li><b>Agenda:</b> ${data.agenda}</li>
      </ul>
      <p>-- System Notification</p>
    `;
    Promise.all(
      members.map((m) => (m.email ? sendEmail(m.email, m.name || m.email, message) : null)),
    ).catch((err) => console.error('Bulk email send error:', err));

    return announcement;
  }

  static async getGroupAnnouncements(groupId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Announcement.findAndCountAll({
      where: { groupId },
      order: [
        ['meetingDate', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      offset,
      limit,
    });
    return { items: rows, total: count, page, limit };
  }

  static async getAnnouncementById(id: string) {
    return Announcement.findByPk(id);
  }

  static async updateAnnouncement(
    id: string,
    data: Partial<{
      title: string;
      meetingDate: string | Date;
      meetingTime: string;
      location: string;
      agenda: string;
      status: 'scheduled' | 'completed' | 'postponed';
      attendeesCount: number;
    }>,
  ) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new Error('Announcement not found');

    await announcement.update(data as any);
    return announcement;
  }

  static async deleteAnnouncement(id: string) {
    const ann = await Announcement.findByPk(id);
    if (!ann) return null;
    await ann.destroy();
    return true;
  }
}

export default AnnouncementService;
