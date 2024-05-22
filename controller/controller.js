const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const RequestedCallModel = require("../models/requestCallModel")
const FundraiseModel = require("../models/fundraisModel")
const Notification = require("../models/notifications");
const axios = require("axios");
const AWS = require("aws-sdk");
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();
const nodemailer = require("nodemailer");

const s3 = new AWS.S3({
  region: process.env.REGION, 
  accessKeyId: process.env.ACCESS_KEY_Id,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

function generateOTP() {
  const otpLength = 6;
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < otpLength; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}

exports.sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    const username = email.split("@")[0];
    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "gamextech6@gmail.com",
        pass: "egtl ualu rmyh gxik",
      },
    });

    var mailOptions = {
      from: "gamextech6@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: `<div style="font-family: Arial, sans-serif; background-color: white; width: 560px; padding: 1.5%; border: 5px solid gray; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 0 auto;">
        <div style="text-align: center;"><img src="https://drive.google.com/uc?export=view&id=1mpcNOOM9cYRtDmCIJwgqyJHOn6kCMPpy" alt="logo image" style="width: 65%;"></div>
        <h2 style="text-align: center;">OTP Verification</h2>
        <p style="margin: 3%; margin-top: 7%;">Hello, <strong style="font-size: medium;">${username}</strong></p> <!-- Display only username -->
        <p style="margin: 3%;">Your OTP for verification is: <strong><span style="background-color:#56d1a7;color:white;padding: 1.2%;margin: 1%;border-radius: 10%;font-size: large;">${otp}</span></strong></p>
        <div style="position: relative; color: white;">
            <div style="background-image: url(https://drive.google.com/uc?export=view&id=1hsPbU3CN1d4sSoBw7Hx97v8x9mmY_FNn); position: absolute; width: 100%; height: 100%; background-size: cover; border-radius: 10px;">
                <div style="position: absolute; padding: 5%;">
                    <p>Please enter this code to verify your account.</p>
                    <p>If you did not request this verification, please ignore this email.</p>
                    <p>Thank you,</p>
                    <p style="color: #56D1A7;">Givehand</p>
                </div>
            </div>
        </div>
        <div style="margin-top: 20px; text-align: center; margin-top: 6%;">
            <div>
                <a href="https://www.facebook.com"><img src="https://drive.google.com/uc?export=view&id=1NzlujVPFIRklmG_KzeQMQd4nXow41tn6" alt="Facebook" style="width: 4%;"></a>
                <a href="https://twitter.com"><img src="https://drive.google.com/uc?export=view&id=1X0xYFTi5OfVNQB2ZkWpSNFnrXoTSnco0" alt="Facebook" style="width: 4%;"></a>
                <a href="https://www.instagram.com"><img src="https://drive.google.com/uc?export=view&id=1XdickFqihVhFpI-BAUFZ0HBP7ljzfQar" alt="Instagram" style="width: 4%;"></a>
                <a href="mailto:your.email@example.com"><img src="https://drive.google.com/uc?export=view&id=1p191jxD60Tb1T6BkP27LtqT2iaVfajXV" alt="Email" style="width: 4%;"></a>
                <a href="https://www.youtube.com"><img src="https://drive.google.com/uc?export=view&id=1veytBKE5175fh4vxq_jiXtlK35LCsAkl" alt="YouTube" style="width: 4%;"></a>
            </div>
            <div>
                <p style="opacity: 0.5;">Follow Us On Social Media To Give Hand In Making A Difference</p>
            </div>
        </div>
    </div>
    `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res
          .status(500)
          .send({ success: false, message: "Failed to send email" });
      } else {
        await UserModel.findOneAndUpdate(
          { email },
          { $set: { otp }, passward: "X*X" }
        );
        console.log("Email sent: ", info.response);
        return res
          .status(200)
          .send({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error during sending email:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

exports.signUp = async (req, res) => {
  const { email, passward, fullName } = req.body;

  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(201).send({
      sucess: true,
      message: "Account Already Exists",
    });
  } else if(passward.length>0) {
    const otpDocument = await UserModel.create({ email, passward, fullName });

    if (otpDocument) {
      return res.status(200).send({
        sucess: true,
        message: "Account Created Successfully",
      });
    } else {
      res.json({ message: "Account Not Created" });
    }
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const otpDocument = await UserModel.findOne({ email });

  if (otpDocument) {
    const storedOTP = otpDocument.otp;

    if (otp === storedOTP) {
      res.status(200).send({
        sucess: true,
        message: "Verified successfully",
      });
      otpDocument.otp = "";
      otpDocument.save();
    } else {
      res.json({ message: "Invalid OTP" });
    }
  } else {
    res.json({ message: "No OTP found" });
  }
};

exports.signIn = async (req, res) => {
  const { email, passward } = req.body;

  const otpDocument = await UserModel.findOne({ email });

  if (otpDocument) {
    const storedPassward = otpDocument.passward;

    if (passward === storedPassward) {
      return res.status(200).send({
        sucess: true,
        message: "Verified successfully",
      });
    } else {
      res.json({ message: "Invalid Passward" });
    }
  } else {
    res.json({ message: "No Passward found" });
  }
};

exports.setPassward = async (req, res) => {
  const { email, passward } = req.body;

  const otpDocument = await UserModel.findOne({ email, passward: "X*X" });

  if (otpDocument) {
    otpDocument.passward = passward;
    otpDocument.save();
    return res.status(200).send({
      sucess: true,
      message: "New Passward created successfully",
    });
  } else {
    res.json({ message: "User Not Found" });
  }
};

exports.requestCall  = async (req, res) => {
  const { fullName, email, phoneNumber } = req.body;

  const user = await RequestedCallModel.findOne({ email });
  if (user) {
    return res.status(201).send({
      sucess: true,
      message: "Your Request Already Exists",
    });
  } else {
    const otpDocument = await RequestedCallModel.create({ email, phoneNumber, fullName });

    if (otpDocument) {
      return res.status(200).send({
        sucess: true,
        message: "Your Request Created Successfully",
      });
    } else {
      res.json({ message: "Your Request Not Created" });
    }
  }
};

exports.userFundraiseRequest = async (req, res) => {
  const { fullName, email, phoneNumber, category, subCategory, title, description } = req.body;

  const newFundraise = await FundraiseModel.create({ fullName, email, phoneNumber, category, subCategory, title, description });

  const photos = [];
  const documents = [];

  if (req.files["photo"]) {
    for (const photo of req.files["photo"]) {
      const photoKey = `photo/${email}/${Date.now()}-${photo.originalname}`;
      const photoParams = {
        Bucket: process.env.PHOTO_BUCKET,
        Key: photoKey,
        Body: photo.buffer,
      };
      const s3UploadPhotoResponse = await s3.upload(photoParams).promise();
      photos.push(s3UploadPhotoResponse.Location);
    }
    newFundraise.photo = photos;
  }

  if (req.files["document"]) {
    for (const document of req.files["document"]) {
      const documentKey = `document/${email}/${Date.now()}-${document.originalname}`;
      const documentParams = {
        Bucket: process.env.DOCUMENT_BUCKET,
        Key: documentKey,
        Body: document.buffer,
      };
      const s3UploadDocumentResponse = await s3.upload(documentParams).promise();
      documents.push(s3UploadDocumentResponse.Location);
    }
    newFundraise.document = documents;
  }

  await newFundraise.save();

  if (newFundraise) {
    return res.status(200).json({
      success: true,
      message: "New User Fundraise Request created successfully",
      newFundraise
    });
  } else {
    return res.status(500).json({ message: "New User Fundraise Request is not created" });
  }
};

exports.getAllFundraises = async (req, res) => {
  try {
    const fundraises = await FundraiseModel.find();
    res.status(200).json(fundraises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFundraisesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const fundraises = await FundraiseModel.find({ category });
    res.status(200).json(fundraises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFundraiseById = async (req, res) => {
  try {
    const id = req.params.id;
    const fundraise = await FundraiseModel.findById(id);
    if (!fundraise) {
      return res.status(404).json({ message: 'Fundraise not found' });
    }
    res.status(200).json(fundraise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

