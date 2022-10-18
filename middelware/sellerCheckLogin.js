const jwt = require('jsonwebtoken');
const sellerCheckLogin = async(req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization;
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const{ email, id } = decoded;
        req.email = email;
        req.userId = id;
        next();
    } catch (error) {
        // res.send('notAdmin');
        next('Authentication failure!');
    }
}
module.exports = sellerCheckLogin;