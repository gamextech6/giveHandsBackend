const express = require("express");
const router = express.Router();
const multer = require('multer');

const { 
    sendMail,
    signUp,
    verifyOTP,
    signIn,
    setPassward,
    requestCall,
    contact, 
    userFundraiseRequest,
    getAllFundraises,
    getFundraisesByCategory,
    getFundraiseById,
    createUserProfile,
    getUserDetails
    } = require("../controller/controller");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: 'photo'},
    { name: 'document'},
  ]);

router.post("/mail-otp", sendMail);
router.post("/sign-up", signUp);
router.post("/verify-otp", verifyOTP);
router.post("/sign-in", signIn);
router.post("/set-new-passward", setPassward);
router.post("/request-call", requestCall);
router.post("/contest-us", contact);
router.post("/fundraise-request", upload, userFundraiseRequest);
router.post('/fundraises', getAllFundraises);
router.post('/fundraisesbycatagory', getFundraisesByCategory);
router.post('/fundraisebyid', getFundraiseById);
router.post('/createUsers', createUserProfile);
router.get('/users', getUserDetails);



// router.post("/upload-pan/:phoneNumber", upload.single('pan'), uploadPan);
// router.post("/upload-aadhar/:phoneNumber", upload.single('aadhar'), uploadAadhar);

module.exports = router;