const { NormalUser } = require("../model/userModel");
const createToken = require("../utilities/createToken");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");
const otpToEmail = require("../utilities/sendMail");
const { findOrCreateGoogleUser } = require("../utilities/googleAuth");

const otpStore = new Map();

const register = catchAsync(async (req, res, next) => {
  const { username, email, phonenumber, password } = req.body;
  if (!username || !email || !phonenumber || !password) {
    return next(new AppError("All fields are required", 400));
  }
  const isUserExist = await NormalUser.findOne({ email });
  const isPhoneNumberExist = await NormalUser.findOne({ phonenumber });
  if (isUserExist) {
    return next(new AppError("User already exists", 400));
  }
  if (isPhoneNumberExist) {
    return next(new AppError("Phone number already exists", 400));
  }
  const newUser = new NormalUser({ username, email, phonenumber, password });
  const user = await newUser.save();
  const userObj = user.toObject();
  delete userObj.password;
  const token = createToken(user._id, "user");
  res.cookie("user-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
  return res
    .status(201)
    .json({ message: "user created", user: userObj, token });
});

// const login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new AppError("Email and password are required", 400));
//   }

//   const user = await NormalUser.findOne({ email });
//   if (!user) {
//     return next(new AppError("Invalid email or password", 401));
//   }

//   const isMatch = await user.comparePassword(password.toString());
//   if (!isMatch) {
//     return next(new AppError("Invalid email or password", 401));
//   }

//   const token = createToken(user._id, "user");

//   const userObj = user.toObject();
//   delete userObj.password;

//   res.status(200).json({
//     message: "Logged in successfully",
//     user: userObj,
//     token,
//   });
// });

const sendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const [response, status, otp] = await otpToEmail(email);
  otpStore.set(email, {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
    userData: req.body,
  });

  res.status(200).json({
    status: "Success",
    message: "OTP has been sent successfully to your email",
    content: {
      email,
    },
  });
});
const userLogOut = catchAsync(async (req, res, next) => {
  res.clearCookie("user-auth-token");

  res.status(200).json({
    message: "Logged out successfully",
  });
});

const listUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    NormalUser.find()
      .skip(skip)
      .limit(limit)
      .select("username email phonenumber address createdAt isBlocked"),
    NormalUser.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  // Get stored OTP data
  const storedOtpData = otpStore.get(email);
  if (!storedOtpData) {
    return next(new AppError("No OTP found. Please request a new OTP.", 400));
  }

  // Check if OTP is expired
  if (Date.now() > storedOtpData.expires) {
    otpStore.delete(email);
    return next(new AppError("This OTP is expired. Try again..", 401));
  }

  // Verify OTP
  if (storedOtpData.otp !== otp) {
    return next(new AppError("Incorrect OTP. Check your inbox again...", 400));
  }
  const userExists = await NormalUser.findOne({ email });
  if (!userExists) {
    const newUser = new NormalUser(storedOtpData.userData);
    if (!newUser) {
      return next(new AppError("Failed to create user", 500));
    }
    const savedUser = await newUser.save();

    const token = createToken(savedUser._id);

    res.status(200).json({
      status: "Success",
      message: "User created successfully",
      content: {
        user: savedUser,
      },
      token,
    });
  } else {
    const token = createToken(userExists._id);
    res.status(200).json({
      status: "Success",
      content: {
        user: userExists,
      },
      token,
    });
  }

  // const savedUser = await newUser.save();
  // Create cart for the user

  // Save user

  // Clear OTP after successful verification
  // otpStore.delete(email);

  // sendToken(newUser, 201, res);
});

const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Get stored OTP data
  const storedOtpData = otpStore.get(email);
  if (!storedOtpData) {
    return next(
      new AppError("Email not found. Please request a new OTP.", 400)
    );
  }

  // Send new OTP
  const [response, status, newOtp] = await otpToEmail(email);

  if (status !== "OK") {
    return next(new AppError("Failed to send OTP. Please try again.", 500));
  }

  // Update stored OTP with new OTP
  otpStore.set(email, {
    otp: newOtp,
    expires: Date.now() + 10 * 60 * 1000,
    userData: storedOtpData.userData,
  });

  res.status(200).json({
    status: "Success",
    message: "New OTP has been sent successfully to your email",
    content: {
      email,
    },
  });
});

const searchUser = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const users = await NormalUser.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phonenumber: { $regex: search, $options: "i" } },
    ],
  });
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

const checkUser = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const user = await NormalUser.findById(userId);
  res.status(200).json({ user });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const updateData = req.body;

  let updatedUser;
  if (updateData.address) {
    updatedUser = await NormalUser.findByIdAndUpdate(
      userId,
      {
        $push: { address: updateData.address },
      },
      { new: true }
    );
  } else {
    updatedUser = await NormalUser.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  }

  const userObj = updatedUser.toObject();
  delete userObj.password;
  res.status(200).json(userObj);
});

const deleteUserAddress = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const addressId = req.params.id;

  const updatedUser = await NormalUser.findByIdAndUpdate(
    userId,
    { $pull: { address: { _id: addressId } } },
    { new: true }
  );

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Address deleted successfully",
    data: updatedUser,
  });
});

// Google Auth controller
const googleLogin = catchAsync(async (req, res, next) => {
  const { accessToken, userInfo } = req.body;


  if (!accessToken || !userInfo) {
    return next(
      new AppError("Google access token and user info are required", 400)
    );
  }

  try {
    // Create user data from Google user info
    const googleData = {
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      emailVerified: userInfo.verified_email || false,
    };

 

    // Find or create user
    const result = await findOrCreateGoogleUser(googleData);

    if (!result) {
      console.error("Result is undefined");
      return next(
        new AppError("Google authentication failed - no result", 500)
      );
    }

    if (!result.user) {
      console.error("Result has no user");
      return next(new AppError("Google authentication failed - no user", 500));
    }

    if (!result.token) {
      console.error("Result has no token");
      return next(new AppError("Google authentication failed - no token", 500));
    }

    res.status(200).json({
      status: "Success",
      message: "Google authentication successful",
      content: {
        user: result.user,
      },
      token: result.token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return next(
      new AppError(error.message || "Google authentication failed", 500)
    );
  }
});

module.exports = {
  register,
  // login,
  userLogOut,
  listUsers,
  searchUser,
  checkUser,
  updateUser,
  deleteUserAddress,
  sendOtp,
  verifyOtp,
  resendOtp,
  googleLogin,
};
