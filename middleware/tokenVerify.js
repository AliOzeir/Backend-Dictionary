const jwt = require('jsonwebtoken');
const models = require('./../models');

// --- Verify that the token is true
exports.verifyAndDecode = (req, res, next) => {
    try {
        const jwtToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_KEY);
        req.userData = decodedToken;
        models.Token.findOne({where: {token: jwtToken}})
        .then(result => {
            if(result == null){
                return res.status(401).json({
                    message: "Invalid or expired token",
                    error: err
                })
            } else {
                next();
            }
        }).catch(error => {
            res.status(500).json({
                message: "Server error! - Location: tokenVerify>verifyAndDecode",
                error
            });
        });
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: err
        });
    }
}