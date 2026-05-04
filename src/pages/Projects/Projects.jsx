import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject } from '../../redux/slices/projectSlice';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../../components/Layout/SidebarLayout';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import api from '../../api/axios';

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [], dueDate: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchProjects());
    if (user?.role === 'Admin') {
      api.get('/users').then(res => setUsers(res.data)).catch(err => console.error(err));
    }
  }, [dispatch, user]);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createProject(newProject)).then(() => {
      setShowModal(false);
      setNewProject({ name: '', description: '', members: [], dueDate: '' });
    });
  };

  const handleMemberToggle = (userId) => {
    setNewProject(prev => {
      const isSelected = prev.members.includes(userId);
      if (isSelected) {
        return { ...prev, members: prev.members.filter(id => id !== userId) };
      } else {
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  return (
    <SidebarLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Projects</h2>
          <p className="text-slate-400">Manage and track all your projects & services</p>
        </div>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-teal-400 hover:to-violet-400 text-white rounded-lg font-medium transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div 
              key={project._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="p-6 backdrop-blur-lg bg-slate-800/40 border border-slate-700/50 hover:border-primary/50 rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 group"
            >
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{project.name}</h3>
              <p className="text-slate-400 text-sm mt-2 line-clamp-2">{project.description}</p>
              <div className="mt-6 flex justify-between items-center border-t border-slate-700/50 pt-4">
                <div className="text-xs text-slate-500">
                  Created by {project.createdBy?.name || 'Unknown'}
                </div>
                <div className="text-xs px-2 py-1 rounded-md bg-slate-900/50 text-slate-300 border border-slate-700">
                  {project.members?.length || 0} members
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 backdrop-blur-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <h3 className="text-xl font-bold text-white mb-4">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea 
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                <input 
                  type="date"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white [color-scheme:dark]"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assign Members</label>
                <div className="max-h-40 overflow-y-auto bg-slate-900/50 border border-slate-700 rounded-lg p-2 space-y-1">
                  {users.length > 0 ? users.map(u => (
                    <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-primary focus:ring-primary"
                        checked={newProject.members.includes(u._id)}
                        onChange={() => handleMemberToggle(u._id)}
                      />
                      <span className="text-slate-300 text-sm flex-1">{u.name}</span>
                      <span className="text-slate-500 text-xs">{u.role}</span>
                    </label>
                  )) : (
                    <p className="text-slate-500 text-sm p-2">No users found.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary hover:bg-teal-400 text-white rounded-lg transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </SidebarLayout>
  );
};

export default Projects;
