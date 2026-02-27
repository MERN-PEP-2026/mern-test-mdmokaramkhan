export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService.createUser({ name, email, password });
            return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

