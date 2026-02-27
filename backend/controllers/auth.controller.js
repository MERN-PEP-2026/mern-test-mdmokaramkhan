import authService from '../services/auth.service.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.register(name, email, password);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user, token },
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
