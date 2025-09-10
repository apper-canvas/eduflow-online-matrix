const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'grade_c';

export const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "max_marks_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "date_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "max_marks_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "date_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "max_marks_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getBySubject(subject) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "max_marks_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{"FieldName": "subject_c", "Operator": "EqualTo", "Values": [subject]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by subject:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async createBatch(gradeEntries) {
    try {
      const records = gradeEntries.map(gradeData => ({
        Name: `${gradeData.subject_c} - ${gradeData.exam_type_c}`,
        student_id_c: parseInt(gradeData.student_id_c),
        teacher_id_c: parseInt(gradeData.teacher_id_c),
        subject_c: gradeData.subject_c,
        marks_c: parseFloat(gradeData.marks_c),
        max_marks_c: parseFloat(gradeData.max_marks_c),
        exam_type_c: gradeData.exam_type_c,
        date_c: gradeData.date_c
      }));

      const params = { records };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.map(r => r.data);
      }
    } catch (error) {
      console.error("Error creating grade batch:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: `${gradeData.subject_c} - ${gradeData.exam_type_c}`,
          student_id_c: parseInt(gradeData.student_id_c),
          teacher_id_c: parseInt(gradeData.teacher_id_c),
          subject_c: gradeData.subject_c,
          marks_c: parseFloat(gradeData.marks_c),
          max_marks_c: parseFloat(gradeData.max_marks_c),
          exam_type_c: gradeData.exam_type_c,
          date_c: gradeData.date_c
        }]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${gradeData.subject_c} - ${gradeData.exam_type_c}`,
          student_id_c: parseInt(gradeData.student_id_c),
          teacher_id_c: parseInt(gradeData.teacher_id_c),
          subject_c: gradeData.subject_c,
          marks_c: parseFloat(gradeData.marks_c),
          max_marks_c: parseFloat(gradeData.max_marks_c),
          exam_type_c: gradeData.exam_type_c,
          date_c: gradeData.date_c
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getClassAverages(class_id_c) {
    try {
      // Get all students in the class first
      const { ApperClient } = window.ApperSDK;
      const studentClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const studentsParams = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{"FieldName": "class_id_c", "Operator": "EqualTo", "Values": [class_id_c]}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const studentsResponse = await studentClient.fetchRecords('student_c', studentsParams);
      
      if (!studentsResponse.success || !studentsResponse.data) {
        return [];
      }

      const studentIds = studentsResponse.data.map(s => s.Id);

      if (studentIds.length === 0) {
        return [];
      }

      // Get grades for these students
      const params = {
        fields: [
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "max_marks_c"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "ExactMatch", "Values": studentIds}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const grades = response.data || [];
      const subjects = [...new Set(grades.map(g => g.subject_c))];
      
      return subjects.map(subject => {
        const subjectGrades = grades.filter(g => g.subject_c === subject);
        const average = subjectGrades.reduce((sum, grade) => 
          sum + (grade.marks_c / grade.max_marks_c * 100), 0) / subjectGrades.length;
        
        return {
          subject,
          average: Math.round(average * 100) / 100,
          count: subjectGrades.length
        };
      });
    } catch (error) {
      console.error("Error calculating class averages:", error?.response?.data?.message || error);
      throw error;
    }
  }
};