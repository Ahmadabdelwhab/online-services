// hasRole.js
const hasRole = (requiredRole) => (req, res, next) => {
    try {
        // Assuming req.user.role is set after authentication
        const userRole = req.user.role;
        
        if (userRole === requiredRole || userRole === 'admin') {
            return next(); // proceed if user has the required role or is an admin
        }

        return res.status(403).json({ message: 'Forbidden: Insufficient role privileges' });
    } catch (error) {
        console.error('Role verification error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = hasRole;
