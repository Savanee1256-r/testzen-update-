import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchProfile, updateProfile } from "../../services/examService";

export default function TeacherProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    experience: "",
    qualification: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        subject: user.subject || "",
        experience: user.experience || "",
        qualification: user.qualification || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedProfile = await updateProfile(formData, localStorage.getItem('token'));
      updateUser(updatedProfile?.user || updatedProfile);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        subject: user.subject || "",
        experience: user.experience || "",
        qualification: user.qualification || ""
      });
    }
  };

  return (
    <div className="fade-up">
      <div className="dashboard__page-header">
        <h1 className="dashboard__page-title">Teacher Profile</h1>
        <p className="dashboard__page-sub">Manage your personal information</p>
      </div>

      <div className="card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
          <div className="profile-info">
            <h2>{user?.name || "Teacher"}</h2>
            <p>{user?.email || "teacher@example.com"}</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {editing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Specialization</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g., Computer Science, Mathematics"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  min="0"
                  max="50"
                />
              </div>

              <div className="form-group full-width">
                <label>Highest Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  placeholder="e.g., M.Tech, Ph.D., M.Sc"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-grid">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{user?.name || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{user?.email || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Subject</label>
                <p>{user?.subject || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <p>{user?.experience ? `${user.experience} years` : "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Qualification</label>
                <p>{user?.qualification || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Member Since</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
