import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, msg: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.json({ success: false, msg: "Invalid token payload" });
        }

        if (typeof req.body !== 'object' || req.body === null) {
            req.body = {};
        }

        req.body.userId = decoded.id;

        next();
    } catch (error) {
        return res.json({ success: false, msg: "Unauthorized user" });
    }
};

export default userAuth;
