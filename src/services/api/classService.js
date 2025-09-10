import React from "react";
import Error from "@/components/ui/Error";
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'class_c';

export const classService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "teacher_name_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "student_count_c"}},
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "subjects_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform subjects from multiline text to array
      return (response.data || []).map(classItem => ({
        ...classItem,
        subjects: classItem.subjects_c ? classItem.subjects_c.split('\n').filter(s => s.trim()) : []
      }));
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "teacher_name_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "student_count_c"}},
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "subjects_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const classItem = response.data;
      return {
        ...classItem,
        subjects: classItem.subjects_c ? classItem.subjects_c.split('\n').filter(s => s.trim()) : []
      };
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByGrade(grade) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "section_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "teacher_name_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "student_count_c"}},
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "subjects_c"}}
        ],
        where: [{"FieldName": "grade_c", "Operator": "EqualTo", "Values": [parseInt(grade)]}],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(classItem => ({
        ...classItem,
        subjects: classItem.subjects_c ? classItem.subjects_c.split('\n').filter(s => s.trim()) : []
      }));
    } catch (error) {
      console.error("Error fetching classes by grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(classData) {
    try {
      const params = {
        records: [{
          Name: `${classData.name_c} - ${classData.section_c}`,
          class_id_c: classData.class_id_c,
          name_c: classData.name_c,
          section_c: classData.section_c,
          grade_c: parseInt(classData.grade_c),
          teacher_id_c: parseInt(classData.teacher_id_c),
          teacher_name_c: classData.teacher_name_c,
          capacity_c: parseInt(classData.capacity_c) || 0,
          student_count_c: parseInt(classData.student_count_c) || 0,
          academic_year_c: classData.academic_year_c,
          subjects_c: Array.isArray(classData.subjects) ? classData.subjects.join('\n') : classData.subjects_c
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
          console.error(`Failed to create ${failed.length} classes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, classData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${classData.name_c} - ${classData.section_c}`,
          class_id_c: classData.class_id_c,
          name_c: classData.name_c,
          section_c: classData.section_c,
          grade_c: parseInt(classData.grade_c),
          teacher_id_c: parseInt(classData.teacher_id_c),
          teacher_name_c: classData.teacher_name_c,
          capacity_c: parseInt(classData.capacity_c) || 0,
          student_count_c: parseInt(classData.student_count_c) || 0,
          academic_year_c: classData.academic_year_c,
          subjects_c: Array.isArray(classData.subjects) ? classData.subjects.join('\n') : classData.subjects_c
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
          console.error(`Failed to update ${failed.length} classes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} classes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateStudentCount(class_id_c, count) {
    try {
      // First find the class by class_id_c
      const findParams = {
        fields: [{"field": {"Name": "Id"}}],
        where: [{"FieldName": "class_id_c", "Operator": "EqualTo", "Values": [class_id_c]}],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const findResponse = await apperClient.fetchRecords(tableName, findParams);
      
      if (!findResponse.success || !findResponse.data || findResponse.data.length === 0) {
        console.error("Class not found for student count update");
        return null;
      }

      const classId = findResponse.data[0].Id;

      const params = {
        records: [{
          Id: parseInt(classId),
          student_count_c: parseInt(count)
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
          console.error(`Failed to update student count:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating student count:", error?.response?.data?.message || error);
console.error("Error updating student count:", error?.response?.data?.message || error);
      throw error;
    }
  }
};