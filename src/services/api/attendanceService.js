const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'attendance_c';

export const attendanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
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
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const whereConditions = [];
      
      if (startDate) {
        whereConditions.push({"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]});
      }
      if (endDate) {
        whereConditions.push({"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]});
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date range:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByClassAndDateRange(class_id_c, startDate, endDate) {
    try {
      const whereConditions = [];
      
      if (class_id_c) {
        whereConditions.push({"FieldName": "class_id_c", "Operator": "EqualTo", "Values": [parseInt(class_id_c)]});
      }
      if (startDate) {
        whereConditions.push({"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]});
      }
      if (endDate) {
        whereConditions.push({"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]});
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by class and date range:", error?.response?.data?.message || error);
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
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record ${id}:`, error?.response?.data?.message || error);
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
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
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
      console.error("Error fetching attendance by student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByDate(date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}],
        orderBy: [{"fieldName": "student_id_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByClassAndDate(class_id_c, date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "period_c"}}
        ],
        where: [
          {"FieldName": "class_id_c", "Operator": "EqualTo", "Values": [parseInt(class_id_c)]},
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}
        ],
        orderBy: [{"fieldName": "student_id_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by class and date:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async createBatch(attendanceEntries) {
    try {
      // Remove existing records for the same date and class first if needed
      const { class_id_c, date_c } = attendanceEntries[0] || {};
      if (class_id_c && date_c) {
        const existingRecords = await this.getByClassAndDate(class_id_c, date_c);
        if (existingRecords.length > 0) {
          const deleteParams = {
            RecordIds: existingRecords.map(r => r.Id)
          };
          await apperClient.deleteRecord(tableName, deleteParams);
        }
      }

      const records = attendanceEntries.map(attendanceData => ({
        Name: `Attendance - ${attendanceData.date_c}`,
        student_id_c: parseInt(attendanceData.student_id_c),
        class_id_c: parseInt(attendanceData.class_id_c),
        date_c: attendanceData.date_c,
        status_c: attendanceData.status_c,
        period_c: attendanceData.period_c || "All Day"
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
          console.error(`Failed to create ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.map(r => r.data);
      }
    } catch (error) {
      console.error("Error creating attendance batch:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: `Attendance - ${attendanceData.date_c}`,
          student_id_c: parseInt(attendanceData.student_id_c),
          class_id_c: parseInt(attendanceData.class_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          period_c: attendanceData.period_c || "All Day"
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
          console.error(`Failed to create ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating attendance record:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Attendance - ${attendanceData.date_c}`,
          student_id_c: parseInt(attendanceData.student_id_c),
          class_id_c: parseInt(attendanceData.class_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          period_c: attendanceData.period_c || "All Day"
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
          console.error(`Failed to update ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating attendance record:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting attendance record:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getAttendanceStats(studentId, startDate, endDate) {
    try {
      const whereConditions = [
        {"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}
      ];
      
      if (startDate) {
        whereConditions.push({"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]});
      }
      if (endDate) {
        whereConditions.push({"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]});
      }

      const params = {
        fields: [
          {"field": {"Name": "status_c"}}
        ],
        where: whereConditions,
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const records = response.data || [];
      
      const stats = {
        total: records.length,
        present: records.filter(r => r.status_c === "Present").length,
        absent: records.filter(r => r.status_c === "Absent").length,
        late: records.filter(r => r.status_c === "Late").length,
        excused: records.filter(r => r.status_c === "Excused").length
      };
      
      stats.attendanceRate = stats.total > 0 ? 
        Math.round(((stats.present + stats.late + stats.excused) / stats.total) * 100) : 0;
      
      return stats;
    } catch (error) {
      console.error("Error calculating attendance stats:", error?.response?.data?.message || error);
      throw error;
    }
  }
};