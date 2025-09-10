import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(300);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async getByGrade(grade) {
    await delay(250);
    return classes.filter(c => c.grade === parseInt(grade)).map(c => ({ ...c }));
  },

  async create(classData) {
    await delay(400);
    const highestId = Math.max(...classes.map(c => c.Id), 0);
    const newClass = {
      ...classData,
      Id: highestId + 1,
      classId: classData.classId || `CLS${String(highestId + 1).padStart(3, "0")}`,
      studentCount: 0
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay(350);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classes[index], ...classData, Id: parseInt(id) };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay(300);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes.splice(index, 1);
    return true;
  },

  async updateStudentCount(classId, count) {
    await delay(200);
    const index = classes.findIndex(c => c.classId === classId);
    if (index !== -1) {
      classes[index].studentCount = count;
    }
    return classes[index] ? { ...classes[index] } : null;
  }
};