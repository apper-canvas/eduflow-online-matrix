import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return grades.filter(g => g.studentId === parseInt(studentId)).map(g => ({ ...g }));
  },

  async getBySubject(subject) {
    await delay(250);
    return grades.filter(g => g.subject === subject).map(g => ({ ...g }));
  },

  async createBatch(gradeEntries) {
    await delay(500);
    const createdGrades = [];
    
    for (const gradeData of gradeEntries) {
      const highestId = Math.max(...grades.map(g => g.Id), 0, ...createdGrades.map(g => g.Id));
      const newGrade = {
        ...gradeData,
        Id: highestId + 1 + createdGrades.length
      };
      grades.push(newGrade);
      createdGrades.push({ ...newGrade });
    }
    
    return createdGrades;
  },

  async create(gradeData) {
    await delay(400);
    const highestId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: highestId + 1
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(350);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData, Id: parseInt(id) };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades.splice(index, 1);
    return true;
  },

  async getClassAverages(classId) {
    await delay(300);
    // This would require joining with student data in a real implementation
    const classGrades = grades.filter(g => g.classId === classId);
    const subjects = [...new Set(classGrades.map(g => g.subject))];
    
    return subjects.map(subject => {
      const subjectGrades = classGrades.filter(g => g.subject === subject);
      const average = subjectGrades.reduce((sum, grade) => 
        sum + (grade.marks / grade.maxMarks * 100), 0) / subjectGrades.length;
      
      return {
        subject,
        average: Math.round(average * 100) / 100,
        count: subjectGrades.length
      };
    });
  }
};