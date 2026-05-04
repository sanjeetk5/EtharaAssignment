import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchMyTasks } from '../../redux/slices/taskSlice';
import { motion } from 'framer-motion';
import { CheckSquare, FolderGit2 } from 'lucide-react';
import SidebarLayout from '../../components/Layout/SidebarLayout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { list: tasks, loading: tasksLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchMyTasks());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueProjects = projects.filter(p => p.dueDate && new Date(p.dueDate) < today);
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'Done');

  return (
    <SidebarLayout>
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-slate-400">Here's what's happening with your projects today.</p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
      >
        <motion.div variants={itemVariants} className="p-6 backdrop-blur-lg bg-slate-800/40 border border-slate-700/50 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Projects</p>
              <h3 className="text-3xl font-bold text-white">{projects.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-primary/20 text-primary">
              <FolderGit2 size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="p-6 backdrop-blur-lg bg-slate-800/40 border border-slate-700/50 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">My Tasks</p>
              <h3 className="text-3xl font-bold text-white">{tasks.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-secondary/20 text-secondary">
              <CheckSquare size={24} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="backdrop-blur-lg bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Projects</h3>
          {projectsLoading ? (
            <p className="text-slate-400 animate-pulse">Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer">
                  <h4 className="font-semibold text-slate-200">{project.name}</h4>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{project.description}</p>
                  {project.dueDate && <p className="text-xs text-slate-500 mt-2">Due: {new Date(project.dueDate).toLocaleDateString()}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No projects found.</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="backdrop-blur-lg bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">My Tasks</h3>
          {tasksLoading ? (
            <p className="text-slate-400 animate-pulse">Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task._id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-200">{task.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{task.project?.name}</p>
                      {task.dueDate && <p className="text-xs text-slate-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      task.status === 'Done' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      task.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No assigned tasks.</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="backdrop-blur-lg bg-red-900/10 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-red-400 mb-6">Overdue Items</h3>
          <div className="space-y-4">
            {overdueProjects.length === 0 && overdueTasks.length === 0 ? (
               <p className="text-slate-500">No overdue items! 🎉</p>
            ) : (
               <>
                 {overdueProjects.map(p => (
                   <div key={`p-${p._id}`} className="p-4 rounded-xl bg-red-950/30 border border-red-900/50">
                     <h4 className="font-semibold text-red-300">{p.name} <span className="text-xs font-normal opacity-70">(Project)</span></h4>
                     <p className="text-xs text-red-400/70 mt-1">Due: {new Date(p.dueDate).toLocaleDateString()}</p>
                   </div>
                 ))}
                 {overdueTasks.map(t => (
                   <div key={`t-${t._id}`} className="p-4 rounded-xl bg-red-950/30 border border-red-900/50">
                     <h4 className="font-semibold text-red-300">{t.title} <span className="text-xs font-normal opacity-70">(Task)</span></h4>
                     <p className="text-xs text-red-400/70 mt-1">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                   </div>
                 ))}
               </>
            )}
          </div>
        </motion.div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
