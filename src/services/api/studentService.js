const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'student_c';

export const studentService = {
async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "class_name_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "photo_c"}},
{"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "previous_school_name_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch students:", response.message);
        throw new Error(response.message);
      }

      console.log(`Successfully fetched ${response.data?.length || 0} students from database`);

      // Transform database field names to camelCase for UI consistency with validation
      const transformedData = (response.data || []).map(student => {
        const transformed = {
          Id: student.Id || 0,
          Name: student.Name || `${student.first_name_c || ''} ${student.last_name_c || ''}`.trim() || 'Unknown Student',
          firstName: student.first_name_c || '',
          lastName: student.last_name_c || '',
          email: student.email_c || '',
          phone: student.phone_c || '',
          dateOfBirth: student.date_of_birth_c || '',
          address: student.address_c || '',
          classId: student.class_id_c || null,
          className: student.class_name_c || 'No Class Assigned',
          enrollmentDate: student.enrollment_date_c || new Date().toISOString().split('T')[0],
          photo: student.photo_c || '',
parentContact: student.parent_contact_c || '',
          previousSchoolName: student.previous_school_name_c || ''
        };
        
        // Debug log for students with missing critical data
        if (!transformed.firstName && !transformed.lastName) {
          console.warn(`Student ID ${transformed.Id} has no name data:`, student);
        }
        
        return transformed;
      });

      console.log(`Transformed student data sample:`, transformedData[0]);
      return transformedData;
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      throw error;
    }
  },

async getById(id) {
try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "class_name_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "photo_c"}},
{"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "previous_school_name_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch student by ID:", response.message);
        throw new Error(response.message);
      }

      console.log(`Successfully fetched student ID ${id}:`, response.data);

      // Transform database field names to camelCase for UI consistency with validation
      const student = response.data;
      if (student) {
        const transformed = {
          Id: student.Id || 0,
          Name: student.Name || `${student.first_name_c || ''} ${student.last_name_c || ''}`.trim() || 'Unknown Student',
          firstName: student.first_name_c || '',
          lastName: student.last_name_c || '',
          email: student.email_c || '',
          phone: student.phone_c || '',
          dateOfBirth: student.date_of_birth_c || '',
          address: student.address_c || '',
          classId: student.class_id_c || null,
className: student.class_name_c || 'No Class Assigned',
          enrollmentDate: student.enrollment_date_c || new Date().toISOString().split('T')[0],
          previousSchoolName: student.previous_school_name_c || '',
          photo: student.photo_c || '',
          parentContact: student.parent_contact_c || ''
        };
        
        // Debug log for missing critical data
        if (!transformed.firstName && !transformed.lastName) {
          console.warn(`Student ID ${id} has no name data in database`);
        }
        
        return transformed;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByClassId(classId) {
try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "class_name_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "photo_c"}},
{"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "previous_school_name_c"}}
        ],
        where: [{"FieldName": "class_id_c", "Operator": "EqualTo", "Values": [parseInt(classId)]}],
        orderBy: [{"fieldName": "first_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to camelCase for UI consistency
      const transformedData = (response.data || []).map(student => ({
        Id: student.Id,
        Name: student.Name,
        firstName: student.first_name_c,
        lastName: student.last_name_c,
        email: student.email_c,
        phone: student.phone_c,
        dateOfBirth: student.date_of_birth_c,
        address: student.address_c,
        classId: student.class_id_c,
        className: student.class_name_c,
enrollmentDate: student.enrollment_date_c,
        photo: student.photo_c,
        previousSchoolName: student.previous_school_name_c,
        parentContact: student.parent_contact_c
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching students by class:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: `${studentData.first_name_c} ${studentData.last_name_c}`,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          date_of_birth_c: studentData.date_of_birth_c,
          address_c: studentData.address_c,
          class_id_c: parseInt(studentData.class_id_c),
          class_name_c: studentData.class_name_c,
          enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split("T")[0],
          photo_c: studentData.photo_c || "",
parent_contact_c: studentData.parent_contact_c,
          previous_school_name_c: studentData.previous_school_name_c
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
          console.error(`Failed to create ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        // Transform the created student data to camelCase for UI consistency
        if (successful.length > 0) {
          const student = successful[0].data;
          return {
            Id: student.Id,
            Name: student.Name,
            firstName: student.first_name_c,
            lastName: student.last_name_c,
            email: student.email_c,
            phone: student.phone_c,
            dateOfBirth: student.date_of_birth_c,
            address: student.address_c,
            classId: student.class_id_c,
            className: student.class_name_c,
            enrollmentDate: student.enrollment_date_c,
            photo: student.photo_c,
parentContact: student.parent_contact_c,
            previousSchoolName: student.previous_school_name_c
          };
        }
        return null;
      }
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.first_name_c} ${studentData.last_name_c}`,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          date_of_birth_c: studentData.date_of_birth_c,
          address_c: studentData.address_c,
          class_id_c: parseInt(studentData.class_id_c),
          class_name_c: studentData.class_name_c,
          enrollment_date_c: studentData.enrollment_date_c,
photo_c: studentData.photo_c || "",
          parent_contact_c: studentData.parent_contact_c,
          previous_school_name_c: studentData.previous_school_name_c
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
          console.error(`Failed to update ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        // Transform the updated student data to camelCase for UI consistency
        if (successful.length > 0) {
          const student = successful[0].data;
          return {
            Id: student.Id,
            Name: student.Name,
            firstName: student.first_name_c,
            lastName: student.last_name_c,
            email: student.email_c,
            phone: student.phone_c,
            dateOfBirth: student.date_of_birth_c,
            address: student.address_c,
            classId: student.class_id_c,
            className: student.class_name_c,
            enrollmentDate: student.enrollment_date_c,
            photo: student.photo_c,
parentContact: student.parent_contact_c,
            previousSchoolName: student.previous_school_name_c
          };
        }
        return null;
      }
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  },

async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "class_name_c"}},
          {"field": {"Name": "enrollment_date_c"}},
{"field": {"Name": "photo_c"}},
          {"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "previous_school_name_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "first_name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "last_name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "phone_c", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        }],
        orderBy: [{"fieldName": "first_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to camelCase for UI consistency
      const transformedData = (response.data || []).map(student => ({
        Id: student.Id,
        Name: student.Name,
        firstName: student.first_name_c,
        lastName: student.last_name_c,
        email: student.email_c,
        phone: student.phone_c,
        dateOfBirth: student.date_of_birth_c,
        address: student.address_c,
        classId: student.class_id_c,
        className: student.class_name_c,
        enrollmentDate: student.enrollment_date_c,
photo: student.photo_c,
        parentContact: student.parent_contact_c,
        previousSchoolName: student.previous_school_name_c
      }));

      return transformedData;
    } catch (error) {
      console.error("Error searching students:", error?.response?.data?.message || error);
      throw error;
    }
  }
};