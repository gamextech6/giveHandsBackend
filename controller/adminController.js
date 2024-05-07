const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const Notification = require("../models/notifications");
const RequestedCallModel = require("../models/requestCallModel");
const FundraisModel = require("../models/fundraisModel")
const axios = require('axios');
const AWS = require("aws-sdk");
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_Id,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const os = require("os").platform();

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await AdminModel.findOne({ username, password });

    if (!admin) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    return res.status(200).send({
      sucess: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.find({ email });
    if(!user){
      res.status(201).send({
        sucess: false,
        message: "User Not Found",
      });
    }
    res.status(200).send({
      sucess: true,
      message: "User get successfully",
      data: user,
    });
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getRequestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await RequestedCallModel.find({ email });
    if(!user){
      res.status(201).send({
        sucess: false,
        message: "User Not Found",
      });
    }
    res.status(200).send({
      sucess: true,
      message: "User get successfully",
      data: user,
    });
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.changeStatusByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { status } = req.body;
    const user = await RequestedCallModel.findOneAndUpdate({ email }, { $set: { status: status} });
    if(!user){
      return res.status(201).send({
        sucess: false,
        message: "User Not Found",
      });
    }
    return res.status(200).send({
      sucess: true,
      message: "User Updated Successfully",
      data: user,
    });
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: { blocked: true } },
    );

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    const user1 = await UserModel.find({ email })

    return res.status(200).send({ success: true, message: "User Blocked Successfully",  data: user1 });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Update the user's blocked status
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: { blocked: false } },
    );

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    const user1 = await UserModel.find({ email })

    return  res.status(200).send({ success: true, message: "User Unblocked Successfully", data: user1 });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const totalCount = await UserModel.countDocuments();
    const allUser = await UserModel.find();
    const activeCount = await UserModel.countDocuments({ isActive: true });
    const activeUser = await UserModel.find({ isActive: true });
    const blockedCount = await UserModel.countDocuments({ blocked: true });
    const blockedUser = await UserModel.find({ blocked: true });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalpage = Math.ceil(totalCount/limit);
    const totalUser = allUser.slice(startIndex, endIndex);

    return res
      .status(200)
      .send({
        success: true,
        message: "all user",
        allUserCount: totalCount,
        allUser:totalUser,
        totalpage,
        activeCount: activeCount,
        activeUser:activeUser,
        blockedCount: blockedCount,
        blockedUser: blockedUser
      });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.sendToAllUserNotification = async (req, res) => {
  try {
     const { title, message } = req.body;

  //   // Find all users
    const users = await UserModel.find();

    const notifications = await Notification.create(
      users.map(user => ({ email: user.email,title, message }))
    );

    res.status(200).send({ success: true, message: 'Notifications sent successfully', notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.postNotification = async (req, res) => {
  try {
    const { email,title, message } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const notification = await Notification.create({ email,title, message });
    res.status(200).send({success: true, message: 'Notifications sent successfully', notification});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchNotificationByemail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const seenedNotifications = await Notification.find({ email, seen: true });
    const unSeenedNotifications = await Notification.find({ email, seen: false });
    res.status(200).send({success: true, message: 'Users Notifications', seenedNotifications, unSeenedNotifications});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNotificationByID = async (req, res) => {
  try {
    const { _id } = req.body;
    const deleteNotification = await Notification.findByIdAndDelete({ _id });
    res.status(200).send({success: true, message: 'Notifications Deleted successfully', deleteNotification});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.showNotificationMessage = async (req, res) => {
  try {
    const uniqueMessages = await Notification.distinct('message');
    res.status(200).json({ success: true, message: 'Unique Notification Messages Fetched Successfully', uniqueMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNotificationsByMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const result = await Notification.deleteMany({ message });

    res.status(200).json({
      success: true,
      message: `Notifications with message type '${message}' deleted successfully`,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.userWithdrawlRequest = async (req, res) => {
  try {
    const withdrawlRequests = await UserTransactionsModel.find({ withdrawl_done: false });
    
    res.status(200).send({
      sucess: true,
      message: "User Withdrawl Request.",
      withdrawlRequests
    });
  } catch (error) {
    console.error("Error on subbmitting :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.aproveWithdrawl = async (req, res) => {
  try {
    const { withdrawlID } = req.body;

    const transaction = await UserTransactionsModel.findOneAndUpdate(
      { _id: withdrawlID, withdrawl_done: false },
      { $set: { withdrawl_done: true } }
    );

    if (!transaction || !transaction.amount || !transaction.email) {
      return res.status(404).json({ error: "Transaction not found or missing required information" });
    }

    const email = transaction.email;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.balance -= transaction.amount;
    await user.save();

    res.status(200).send({
      success: true,
      message: "User Withdrawal approved successfully.",
      transaction,
      user
    });
  } catch (error) {
    console.error("Error on submitting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userWithdrawlRequestByWithdrawlID = async (req, res) => {
  try {
    const { withdrawlID } = req.body;

    const transaction = await UserTransactionsModel.findById({ _id: withdrawlID });

    if (!transaction || !transaction.amount || !transaction.email) {
      return res.status(404).json({ error: "Transaction not found or missing required information" });
    }

    return res.status(200).send({
      success: true,
      message: "User Withdrawal approved successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error on submitting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.allWithdrawl = async (req, res) => {
  try {
    const withdrawlList = await UserTransactionsModel.find({ withdrawl_done: true });
    
    res.status(200).send({
      sucess: true,
      message: "All Withdrawl Resolve Request List.",
      withdrawlList
    });
  } catch (error) {
    console.error("Error on subbmitting :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.requestCall = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  try {
    const totalRequestedCalls = await RequestedCallModel.countDocuments();
    const totalPages = Math.ceil(totalRequestedCalls / limitNumber);

    const requestedCall = await RequestedCallModel.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    if (requestedCall.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Requested Call List.",
        currentPage: pageNumber,
        totalPages: totalPages,
        requestedCall,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "No new Call Request found.",
        requestedCall: [],
      });
    }
  } catch (error) {
    console.error("Error on submitting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fundraisRequests = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  try {
    const totalRequestedCalls = await FundraisModel.countDocuments();
    const totalPages = Math.ceil(totalRequestedCalls / limitNumber);

    const requestedCall = await FundraisModel.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    if (requestedCall.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Fundraise Request List.",
        currentPage: pageNumber,
        totalPages: totalPages,
        requestedCall,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "No new Call Request found.",
        requestedCall: [],
      });
    }
  } catch (error) {
    console.error("Error on submitting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fundraisRequestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await FundraisModel.find({ email });
    if(!user){
      res.status(201).send({
        sucess: false,
        message: "Fundrais Event Not Found",
      });
    }
    res.status(200).send({
      sucess: true,
      message: "Fundrais Event get successfully",
      data: user,
    });
    // res.send({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.updateFundraisRequestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body; // New details to update

    // Find the fundraiser request by email and update it with the new details
    const user = await FundraisModel.findOneAndUpdate({ email }, { $set: updates }, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Fundraiser Event Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fundraiser Event updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating fundraiser event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
