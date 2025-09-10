const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'announcement_c';

export const announcementService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "class_id_c"}}
        ],
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
      console.error("Error fetching announcements:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "class_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching announcement ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByAudience(audience) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "class_id_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "target_audience_c", "operator": "EqualTo", "values": [audience]}], "operator": ""},
            {"conditions": [{"fieldName": "target_audience_c", "operator": "EqualTo", "values": ["All"]}], "operator": ""}
          ]
        }],
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
      console.error("Error fetching announcements by audience:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "class_id_c"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}],
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
      console.error("Error fetching announcements by priority:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(announcementData) {
    try {
      const params = {
        records: [{
          Name: announcementData.title_c,
          title_c: announcementData.title_c,
          content_c: announcementData.content_c,
          author_id_c: announcementData.author_id_c,
          author_name_c: announcementData.author_name_c,
          target_audience_c: announcementData.target_audience_c,
          date_c: announcementData.date_c || new Date().toISOString().split("T")[0],
          priority_c: announcementData.priority_c,
          class_id_c: announcementData.class_id_c || ""
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
          console.error(`Failed to create ${failed.length} announcements:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating announcement:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, announcementData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: announcementData.title_c,
          title_c: announcementData.title_c,
          content_c: announcementData.content_c,
          author_id_c: announcementData.author_id_c,
          author_name_c: announcementData.author_name_c,
          target_audience_c: announcementData.target_audience_c,
          date_c: announcementData.date_c,
          priority_c: announcementData.priority_c,
          class_id_c: announcementData.class_id_c || ""
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
          console.error(`Failed to update ${failed.length} announcements:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating announcement:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} announcements:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting announcement:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getRecent(limit = 5) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "class_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": parseInt(limit), "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent announcements:", error?.response?.data?.message || error);
      throw error;
    }
  }
};