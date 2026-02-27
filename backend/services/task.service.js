import Task from '../models/tasks.js';

const createTask = async (taskData, userId) => {
    taskData.createdBy = userId;
    const task = await Task.create(taskData);
    return task;
};

const getTaskById = async (taskId) => {
    const task = await Task.findById(taskId);
    return task;
};

const updateTask = async (taskId, taskData) => {
    const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
    return task;
};

const deleteTask = async (taskId) => {
    await Task.findByIdAndDelete(taskId);
};

const getAllTasksByUserId = async (userId) => {
    const tasks = await Task.find({ createdBy: userId });
    return tasks;
};

export default { createTask, getTaskById, updateTask, deleteTask, getAllTasksByUserId };
