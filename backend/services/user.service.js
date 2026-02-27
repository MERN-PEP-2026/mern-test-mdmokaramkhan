import User from '../models/users.js';

const createUser = async (userData) => {
    const user = await User.create(userData);
    return user;
};

const getUserById = async (userId) => {
    const user = await User.findById(userId);
    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

const updateUser = async (userId, userData) => {
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    return user;
};

const deleteUser = async (userId) => {
    await User.findByIdAndDelete(userId);
};

const getAllUsers = async () => {
    const users = await User.find();
    return users;
};

export default { createUser, getUserById, getUserByEmail, updateUser, deleteUser, getAllUsers };
