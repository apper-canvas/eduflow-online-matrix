import React from "react";
import Error from "@/components/ui/Error";
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'teacher_c';

export const teacherService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "subjects_c"}},
          {"field": {"Name": "classes_assigned_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "experience_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform subjects and classes from multiline text to arrays
      return (response.data || []).map(teacher => ({
        ...teacher,
        subjects: teacher.subjects_c ? teacher.subjects_c.split('\n').filter(s => s.trim()) : [],
        classesAssigned: teacher.classes_assigned_c ? teacher.classes_assigned_c.split('\n').filter(c => c.trim()) : []
      }));
    } catch (error) {
      console.error("Error fetching teachers:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "subjects_c"}},
          {"field": {"Name": "classes_assigned_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "experience_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const teacher = response.data;
      return {
        ...teacher,
        subjects: teacher.subjects_c ? teacher.subjects_c.split('\n').filter(s => s.trim()) : [],
        classesAssigned: teacher.classes_assigned_c ? teacher.classes_assigned_c.split('\n').filter(c => c.trim()) : []
      };
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getBySubject(subject) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "subjects_c"}},
          {"field": {"Name": "classes_assigned_c"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "experience_c"}}
        ],
        where: [{"FieldName": "subjects_c", "Operator": "Contains", "Values": [subject]}],
        orderBy: [{"fieldName": "first_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(teacher => ({
        ...teacher,
        subjects: teacher.subjects_c ? teacher.subjects_c.split('\n').filter(s => s.trim()) : [],
        classesAssigned: teacher.classes_assigned_c ? teacher.classes_assigned_c.split('\n').filter(c => c.trim()) : []
      }));
    } catch (error) {
      console.error("Error fetching teachers by subject:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(teacherData) {
    try {
      const params = {
        records: [{
          Name: `${teacherData.first_name_c} ${teacherData.last_name_c}`,
          teacher_id_c: teacherData.teacher_id_c,
          first_name_c: teacherData.first_name_c,
          last_name_c: teacherData.last_name_c,
          email_c: teacherData.email_c,
          phone_c: teacherData.phone_c,
          subjects_c: Array.isArray(teacherData.subjects) ? teacherData.subjects.join('\n') : teacherData.subjects_c,
          classes_assigned_c: Array.isArray(teacherData.classesAssigned) ? teacherData.classesAssigned.join('\n') : teacherData.classes_assigned_c,
          employee_id_c: teacherData.employee_id_c,
          department_c: teacherData.department_c,
          experience_c: parseInt(teacherData.experience_c) || 0
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
          console.error(`Failed to create ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating teacher:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, teacherData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${teacherData.first_name_c} ${teacherData.last_name_c}`,
          teacher_id_c: teacherData.teacher_id_c,
          first_name_c: teacherData.first_name_c,
          last_name_c: teacherData.last_name_c,
          email_c: teacherData.email_c,
          phone_c: teacherData.phone_c,
          subjects_c: Array.isArray(teacherData.subjects) ? teacherData.subjects.join('\n') : teacherData.subjects_c,
          classes_assigned_c: Array.isArray(teacherData.classesAssigned) ? teacherData.classesAssigned.join('\n') : teacherData.classes_assigned_c,
          employee_id_c: teacherData.employee_id_c,
          department_c: teacherData.department_c,
          experience_c: parseInt(teacherData.experience_c) || 0
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
          console.error(`Failed to update ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating teacher:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting teacher:", error?.response?.data?.message || error);
      throw error;
}
  }
};