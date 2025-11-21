import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const hrOnly = (req, res, next) => {
    if (req.user.role !== "hr") {
        return res.status(403).json({ message: "Access denied: HR only" });
    }
    next();
};
