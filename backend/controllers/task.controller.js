import taskService from '../services/task.service.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await taskService.createTask({ title, description, status }, req.user._id);
        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasksByUserId(req.user._id);
        return res.status(200).json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await taskService.updateTask(req.params.id, { title, description, status });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await taskService.deleteTask(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
