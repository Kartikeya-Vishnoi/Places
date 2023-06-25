const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    //We can extract token either by inserting it int he url and then extrcting it using params or
    //We can use the metadata which is sent along with each request, which consists of the header map
    //here we break the value of the key authorization in the header.
    try {
      const token = req.headers.authorization.split(' ')[1];   
      //the value of the key authorization is "bearers token_string", thats why we split the value through a space

      //if token is null or not present
      if(!token){
        throw new Error('Authentication Failed')
      }
      //if token is present we will verify it using jwt
      const decodeToken = jwt.verify(token, 'supersecret_dont_share');
      //if token is not valid then decodeToken will throw an error, which will be caught by the catch block
      //After decodedToken is verified we  dynamically add data to the request object  
      //becuse when we create a token we add an userid to its payload
      req.userData = { userId: decodeToken.userId}
      next();
    } catch (err) {
        const error = new HttpError("Authentication Failed", 403);
        return next(error)
    }
}