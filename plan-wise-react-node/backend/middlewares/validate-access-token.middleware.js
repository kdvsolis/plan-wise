const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    try{
        let token  = req.headers.authorization? req.headers.authorization.slice(7, req.headers.authorization.length) : null;
        if(token == null){
            res.status(401).send("Forbidden");
            return;
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).send("Forbidden");
                return;
            }
            
            // If the token is valid, add the user's id to the request object
            req.user_id = decoded.user_id;
            
            next();
        });
    }catch(e){
        console.error(e);
        res.status(401).send("Forbidden");
        return;
    }
};

module.exports = { validateToken };