const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Forbidden – admin access required."
        });
    }
};

export default verifyAdmin;
