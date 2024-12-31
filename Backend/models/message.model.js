import mongoose from "mongoose";

const MessageSchema = mongoose.Schema ({
    conversationId: {
        type: String
    },
    senderId: {
        type: String
    },
    message: {
        type: String
    }
})

const MessageSchemaModel = mongoose.model('Message' , MessageSchema);

export default MessageSchemaModel;