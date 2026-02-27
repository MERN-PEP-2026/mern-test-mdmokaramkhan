import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from './user.service.js';

const register = async (name, email, password) => {
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({ name, email, password: hashedPassword });
    return user;
};

const login = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
};

export default { register, login };
