import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    token: {
        type: String
    }
});

const UserSchemaModel  = mongoose.model('user_collection',UserSchema);

export default UserSchemaModel