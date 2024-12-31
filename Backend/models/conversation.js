import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    members: {
        type: Array,
        required: true
    }  
})

const conversationSchemaModel = mongoose.model('Conversation' , conversationSchema);

export default conversationSchemaModel;