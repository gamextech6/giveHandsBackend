const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
    adminLogin,
    getUserCount,
    getUserByEmail,
    blockUser,
    unblockUser,

    sendToAllUserNotification,
    postNotification,
    searchNotificationByemail,
    deleteNotificationByID,
    showNotificationMessage,
    deleteNotificationsByMessage,
    
    userWithdrawlRequest,
    aproveWithdrawl,
    allWithdrawl, 
    userWithdrawlRequestByWithdrawlID,

    requestCall,
    getRequestByEmail,
    changeStatusByEmail,
    fundraisRequests,
    fundraisRequestByEmail,
    updateFundraisRequestByEmail

} = require("../controller/adminController");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/admin-login", adminLogin);
router.post("/gettotal-user", getUserCount);
router.post("/getuser/:email", getUserByEmail);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);
router.post("/notifications/send-to-all", sendToAllUserNotification);
router.post("/notifications", postNotification);
router.post("/searchNotifications", searchNotificationByemail);
router.post("/deleteNotificationByID", deleteNotificationByID);
router.post("/showNotificationMessage", showNotificationMessage);
router.post("/deleteMessage", deleteNotificationsByMessage);
router.post("/userWithdrawlRequest", userWithdrawlRequest);
router.post("/aproveWithdrawl", aproveWithdrawl);
router.post("/allWithdrawl", allWithdrawl);
router.post("/userWithdrawlRequestByWithdrawlID", userWithdrawlRequestByWithdrawlID);
router.post("/requested-call", requestCall);
router.post("/get-request/:email", getRequestByEmail);
router.post("/change-status/:email", changeStatusByEmail);
router.post("/fundrais-requests", fundraisRequests);
router.post("/fundrais-request/:email", fundraisRequestByEmail);
router.post("/update-fundrais/:email", updateFundraisRequestByEmail);

module.exports = router;