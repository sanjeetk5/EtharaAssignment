import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTaskStatus } from '../../redux/slices/taskSlice';
import { useParams } from 'react-router-dom';
import SidebarLayout from '../../components/Layout/SidebarLayout';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const currentProject = useSelector((state) => state.projects.list.find(p => p._id === projectId));
  
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Todo', assignedTo: '', dueDate: '' });

  useEffect(() => {
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createTask({ ...newTask, project: projectId })).then(() => {
      setShowModal(false);
      setNewTask({ title: '', description: '', status: 'Todo', assignedTo: '', dueDate: '' });
    });
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <SidebarLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Project Tasks</h2>
          <p className="text-slate-400">Manage tasks for this project.</p>
        </div>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-teal-400 hover:to-violet-400 text-white rounded-lg font-medium transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(status => (
            <div key={status} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 min-h-[500px]">
              <h3 className="font-semibold text-slate-300 mb-4 px-2 flex items-center justify-between">
                {status}
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </h3>
              
              <div className="space-y-3">
                {tasks.filter(t => t.status === status).map(task => (
                  <motion.div 
                    layoutId={task._id}
                    key={task._id}
                    className="p-4 backdrop-blur-md bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-lg"
                  >
                    <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                    <p className="text-xs text-slate-400 mb-4">{task.description}</p>
                    
                    <select 
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-700 rounded p-1 text-slate-300 outline-none"
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 backdrop-blur-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add New Task</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea 
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Assign To</label>
                <select 
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="" disabled>Select a member</option>
                  {currentProject?.members?.map(m => (
                    <option key={m._id || m} value={m._id || m}>{m.name || 'Member'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white [color-scheme:dark]"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
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
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </SidebarLayout>
  );
};

export default ProjectDetails;
