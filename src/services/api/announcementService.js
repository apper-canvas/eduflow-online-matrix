import announcementsData from "@/services/mockData/announcements.json";

let announcements = [...announcementsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const announcementService = {
  async getAll() {
    await delay(300);
    return [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await delay(200);
    const announcement = announcements.find(a => a.Id === parseInt(id));
    if (!announcement) {
      throw new Error("Announcement not found");
    }
    return { ...announcement };
  },

  async getByAudience(audience) {
    await delay(250);
    return announcements
      .filter(a => a.targetAudience === audience || a.targetAudience === "All")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(a => ({ ...a }));
  },

  async getByPriority(priority) {
    await delay(250);
    return announcements
      .filter(a => a.priority === priority)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(a => ({ ...a }));
  },

  async create(announcementData) {
    await delay(400);
    const highestId = Math.max(...announcements.map(a => a.Id), 0);
    const newAnnouncement = {
      ...announcementData,
      Id: highestId + 1,
      date: announcementData.date || new Date().toISOString().split("T")[0]
    };
    announcements.unshift(newAnnouncement);
    return { ...newAnnouncement };
  },

  async update(id, announcementData) {
    await delay(350);
    const index = announcements.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    announcements[index] = { ...announcements[index], ...announcementData, Id: parseInt(id) };
    return { ...announcements[index] };
  },

  async delete(id) {
    await delay(300);
    const index = announcements.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    announcements.splice(index, 1);
    return true;
  },

  async getRecent(limit = 5) {
    await delay(200);
    return [...announcements]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(a => ({ ...a }));
  }
};