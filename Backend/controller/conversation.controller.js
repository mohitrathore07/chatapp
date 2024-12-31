import '../models/connection.js';

import conversationSchemaModel from '../models/conversation.js';
import UserSchemaModel from '../models/users.model.js';

export const save = async (req, res) => {
   try {
    const {senderId , receiverId} = req.body;
    const newConversation = new conversationSchemaModel({members: [senderId , receiverId]});
    await newConversation.save();
    res.status(200).send('Conversation Created Successfully');
   }
   catch (err) {
    console.log(err);
   }
}

export const fetch = async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await conversationSchemaModel.find({members: {$in : [userId]}});
        const conversationUserData = Promise.all( conversations.map( async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user =  await UserSchemaModel.findById(receiverId);
            return {user : {receiverId: user.id , email: user.email , fullName: user.fullName} , conversationId: conversation._id};
        }))
        res.status(200).json(await conversationUserData);
    }
    catch(err) {
        console.log(err);
    }
}


