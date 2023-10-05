const {check,validationResult} =require('express-validator');
const {StatusCodes} =require("http-status-codes");
const util= require('util')
const multer = require('multer')
let fs = require('fs-extra')
const path = require("path")
const maxSize = 10 * 1024 * 1024;

const validateSignUpRequest =[
    check('firstName').notEmpty().withMessage("First Name is Required"),
    check('lastName').notEmpty().withMessage("Last Name is Required"),
    check('email').isEmail().withMessage("Valid Email is Required"),
    check('password').isLength({min:6}).withMessage("Password must be at least 6 characters"),
]
const validateSignInRequest=[
    check('email').isEmail().withMessage("Valid Email is Required"),
    check('password').isLength({min:6}).withMessage("Password must be at least 6 characters"),
]
const requestValidator=(req,res, next)=>{
const error= validationResult(req)
  if(error.array().length > 0){
    return res.status(StatusCodes.BAD_REQUEST).json({error:error.array()[0].msg})
  }
  next();
}

const storage =multer.diskStorage({
  destination: (req,file,cb)=>{
    fs.mkdirsSync('./src/upload');
    cb(null, './src/upload');
  },
  filename: (req,file,cb)=>{
      console.log(file)
      cb(null, file.originalname)
  }
});

const uploadFile = multer({
storage:storage,
limits:{fileSize:maxSize}, 
fileFilter: function (req, file, cb){
    
  var filetypes = /jpeg|jpg|pdf|png/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(path.extname(
              file.originalname).toLowerCase());
  
  if (mimetype && extname) {
      return cb(null, true);
  }

  cb("Error: File upload only supports the "
          + "following filetypes - " + filetypes);
} 
}).single('file')

const uploadfile = util.promisify(uploadFile);

const upload = multer({ storage: storage });
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array('profilePicture', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    // console.log("ff",req.files[0].originalname)
    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.file = files;

    // Proceed to the next middleware or route handler
    next();
  });
}
module.exports={
    validateSignUpRequest, validateSignInRequest,requestValidator,uploadfile,uploadMiddleware
}