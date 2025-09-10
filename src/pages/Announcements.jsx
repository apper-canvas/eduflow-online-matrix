import React, { useState, useEffect } from "react";
import AnnouncementCard from "@/components/organisms/AnnouncementCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { announcementService } from "@/services/api/announcementService";
import { toast } from "react-toastify";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAudience, setFilterAudience] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error loading announcements:", error);
      setError(error.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleEdit = (announcement) => {
    toast.info(`Edit announcement: ${announcement.title}`);
  };

  const handleDelete = async (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await announcementService.delete(announcementId);
        await loadAnnouncements();
        toast.success("Announcement deleted successfully");
      } catch (error) {
        toast.error("Failed to delete announcement");
      }
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAudience = filterAudience === "All" || 
                           announcement.targetAudience === filterAudience ||
                           announcement.targetAudience === "All";
    
    const matchesPriority = filterPriority === "All" || announcement.priority === filterPriority;
    
    return matchesSearch && matchesAudience && matchesPriority;
  });

  const getAnnouncementStats = () => {
    return {
      total: announcements.length,
      high: announcements.filter(a => a.priority === "High").length,
      medium: announcements.filter(a => a.priority === "Medium").length,
      low: announcements.filter(a => a.priority === "Low").length
    };
  };

  const stats = getAnnouncementStats();

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnnouncements} />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Announcements
        </h1>
        <p className="text-slate-600">
          Share important updates and notices with the school community
        </p>
      </div>

      {/* Announcement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Megaphone" size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Medium Priority</p>
              <p className="text-2xl font-bold text-amber-600">{stats.medium}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Info" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Low Priority</p>
              <p className="text-2xl font-bold text-green-600">{stats.low}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Manage Announcements</h2>
            <p className="text-sm text-slate-600">Create, edit, and organize school announcements</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search announcements..."
              className="w-64"
            />
            
            <div className="flex items-center space-x-3">
              <FormField
                type="select"
                value={filterAudience}
                onChange={(e) => setFilterAudience(e.target.value)}
                className="w-36"
              >
                <option value="All">All Audiences</option>
                <option value="Students">Students</option>
                <option value="Teachers">Teachers</option>
                <option value="Parents">Parents</option>
              </FormField>
              
              <FormField
                type="select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-32"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </FormField>
              
              <Button variant="primary">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                New Announcement
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Empty 
          title="No announcements created"
          description="Start communicating with your school community by creating your first announcement"
          actionLabel="Create Announcement"
          onAction={() => toast.info("Create announcement functionality would open here")}
          icon="Megaphone"
        />
      ) : filteredAnnouncements.length === 0 ? (
        <Card className="p-12 text-center">
          <ApperIcon name="Search" size={48} className="text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No announcements found</h3>
          <p className="text-slate-600">Try adjusting your search terms or filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.Id}
              announcement={announcement}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;