import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { name } from "ejs";



const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};



export const registerUser = asyncHandler( async ( req, res ) => {
  // get user deatils from frontend
  const { name, email, password } = req.body;

    // validation - not empty
    if ( [ name, email, password ].some( ( field ) => field?.trim() === "" ) ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne( {
        $or: [{name}, {email} ]
    } )
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    
    // create user object - create entry in db
    const user = await User.create({
      name,
      email,
      password,
    });
    
    // remove password and refresh token field from response
    const createdUser = await User.findById( user._id ).select( '-password -refreshToken' )
    
    // check for user creation
    if ( !createdUser ) {
        throw new ApiError(500, "Something went wrong while registering the user!")
    }
    return res.status( 201 ).json(
        new ApiResponse(200,createdUser, "User registered successfully")
    )
})


export const loginUser = asyncHandler( async ( req, res ) => {
  // req body -> data
  const { email, password } = req.body;
  // username or email
  if (email) {
      //find the user
      const user = await User.findOne({
          $or: [{ email }],
        })
        //password check
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }
        //access and referesh token
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
          user._id
        );
      
        const options = {
          httpOnly: true,
          secure: true,
          };
          
        //send cookie
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              {
                accessToken,
                refreshToken,
              },
              "User logged In Successfully"
            )
          );
    }
    throw new ApiError(400, "email is required for logging in.");

})


export const logoutUser = asyncHandler( async ( req, res ) => {
    
      await User.findByIdAndUpdate(
       req.user._id,
       {
         $set: {
           refreshToken: null,
         },
       },
       {
         new: true,
       }
     );

   
     const options = {
       httpOnly: true,
       secure: true,
     };

     return res
       .status(200)
       .clearCookie("accessToken", options)
       .clearCookie("refreshToken", options)
       .json(new ApiResponse(200, {}, "User logged Out"));
} )

export const getUserDetail = asyncHandler( async ( req, res ) => {
    const user = await User.findById( req.user?._id ).select("-password -refreshToken")
    if(!user) return new ApiError(404, "No user found") 
    return res.status(200).json(new ApiResponse(200,user,"User Details Fetched Successfully"))
} )

export const updateUserDetails = asyncHandler( async ( req, res ) => {
     const {name, email, password} = req.body

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save(); // This will trigger the pre-save hook

    const updatedUser = await User.findById(req.user?._id).select("-password")
          return res
            .status(200)
            .json(
              new ApiResponse(200, updatedUser, "Account details updated successfully")
            );
    }
    
 )


export const deleteUser = asyncHandler( async ( req, res ) => {
    const user = User.findById(req.user._id).select("-password -refreshToken");
    if ( !user ) return new ApiError( 404, "No user found" );
    await User.deleteOne({_id: req.user._id})
    return res
      .status(200)
      .send({
        success: true,
        message: "User deleted successfully",
      });
} )
