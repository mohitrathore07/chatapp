import MessageSchemaModel from "../models/message.model.js";
import '../models/connection.js';
import UserSchemaModel from "../models/users.model.js";
import conversationSchemaModel from "../models/conversation.js";

export const save = async (req , res ) => {
    try {
    const {conversationId, senderId , message , receiverId = ''} = req.body;
    if(!senderId , !message) return res.status(400).send('Please fill all the required fields');
    if(conversationId === 'new' && receiverId) {
        const newConversation = new conversationSchemaModel({members: [senderId , receiverId]});
        await newConversation.save();
        const newMessage = new MessageSchemaModel({conversationId: newConversation._id , senderId , message});
        await newMessage.save();
        return res.status(200).send("Message sent successfully");
    }
    else if(!conversationId && !receiverId){
        return res.status(400).send('Please fill all required fields');
    }
    const newMessage = new MessageSchemaModel({conversationId, senderId , message});
    await newMessage.save();
    res.status(200).send('Message Created Successfully...');
    }
    catch (err) {
        console.log(err);
    }
}

export const fetch = async (req , res) => {
    try {
        const checkmessages = async (conversationId) => {
            const messages = await MessageSchemaModel.find({conversationId});
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await UserSchemaModel.findById(message.senderId);
                return {user: {id : user._id ,email: user.email , fullName: user.fullName }, message: message.message};
            }))
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if(conversationId === 'new')
        {  
            const checkConversation = await conversationSchemaModel.find({members: {$all: [req.query.senderId , req.query.receiverId]}})
            if(checkConversation.length > 0) {
                checkmessages(checkConversation[0]._id);
            }
            else {
                return res.status(200).json([]);
            }
        }
        else {
            checkmessages(conversationId);
        }
    }
    catch (err) {
        console.log(err);
    }
}