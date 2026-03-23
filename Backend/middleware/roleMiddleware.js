// simple middleware generator to enforce user roles
module.exports.requireRole = function(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // allow both exact string or array membership
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
        next();
    };
};
