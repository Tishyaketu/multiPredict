import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerAdmin = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedAdmin = await Admin.findOne({ email })

    if (existedAdmin) {
        throw new ApiError(409, "Admin with email already exists")
    }

    const admin = await Admin.create({
        fullName,
        email,
        password
    })

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    )
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const admin = await Admin.findOne({ email })

    if (!admin) {
        throw new ApiError(404, "Admin does not exist")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("adminAccessToken", accessToken, options)
        .cookie("adminRefreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { admin: loggedInAdmin, accessToken, refreshToken },
                "Admin logged In Successfully"
            )
        )
})

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("adminAccessToken", options)
        .clearCookie("adminRefreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged Out"))
})

const refreshAdminAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.adminRefreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const admin = await Admin.findById(decodedToken?._id)

        if (!admin) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== admin?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(admin._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("adminAccessToken", accessToken, options)
            .cookie("adminRefreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.admin,
            "Admin fetched successfully"
        ))
})

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAdminAccessToken,
    getCurrentAdmin
}
