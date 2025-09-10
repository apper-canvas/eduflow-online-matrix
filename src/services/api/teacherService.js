import teachersData from "@/services/mockData/teachers.json";

let teachers = [...teachersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const teacherService = {
  async getAll() {
    await delay(300);
    return [...teachers];
  },

  async getById(id) {
    await delay(200);
    const teacher = teachers.find(t => t.Id === parseInt(id));
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    return { ...teacher };
  },

  async getBySubject(subject) {
    await delay(250);
    return teachers.filter(t => t.subjects.includes(subject)).map(t => ({ ...t }));
  },

  async create(teacherData) {
    await delay(400);
    const highestId = Math.max(...teachers.map(t => t.Id), 0);
    const newTeacher = {
      ...teacherData,
      Id: highestId + 1,
      teacherId: teacherData.teacherId || `T${String(highestId + 1).padStart(3, "0")}`,
      employeeId: teacherData.employeeId || `EMP${String(highestId + 1).padStart(3, "0")}`
    };
    teachers.push(newTeacher);
    return { ...newTeacher };
  },

  async update(id, teacherData) {
    await delay(350);
    const index = teachers.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Teacher not found");
    }
    teachers[index] = { ...teachers[index], ...teacherData, Id: parseInt(id) };
    return { ...teachers[index] };
  },

  async delete(id) {
    await delay(300);
    const index = teachers.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Teacher not found");
    }
    teachers.splice(index, 1);
    return true;
  }
};