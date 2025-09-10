import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return attendance.filter(a => a.studentId === parseInt(studentId)).map(a => ({ ...a }));
  },

  async getByDate(date) {
    await delay(250);
    return attendance.filter(a => a.date === date).map(a => ({ ...a }));
  },

  async getByClassAndDate(classId, date) {
    await delay(250);
    return attendance.filter(a => a.classId === classId && a.date === date).map(a => ({ ...a }));
  },

  async createBatch(attendanceEntries) {
    await delay(500);
    const createdRecords = [];
    
    // Remove existing records for the same date and class first
    const { classId, date } = attendanceEntries[0] || {};
    if (classId && date) {
      attendance = attendance.filter(a => !(a.classId === classId && a.date === date));
    }
    
    for (const attendanceData of attendanceEntries) {
      const highestId = Math.max(...attendance.map(a => a.Id), 0, ...createdRecords.map(a => a.Id));
      const newRecord = {
        ...attendanceData,
        Id: highestId + 1 + createdRecords.length
      };
      attendance.push(newRecord);
      createdRecords.push({ ...newRecord });
    }
    
    return createdRecords;
  },

  async create(attendanceData) {
    await delay(400);
    const highestId = Math.max(...attendance.map(a => a.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: highestId + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(350);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData, Id: parseInt(id) };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance.splice(index, 1);
    return true;
  },

  async getAttendanceStats(studentId, startDate, endDate) {
    await delay(300);
    const records = attendance.filter(a => 
      a.studentId === parseInt(studentId) &&
      a.date >= startDate &&
      a.date <= endDate
    );
    
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === "Present").length,
      absent: records.filter(r => r.status === "Absent").length,
      late: records.filter(r => r.status === "Late").length,
      excused: records.filter(r => r.status === "Excused").length
    };
    
    stats.attendanceRate = stats.total > 0 ? 
      Math.round(((stats.present + stats.late + stats.excused) / stats.total) * 100) : 0;
    
    return stats;
  }
};