import '../models/connection.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserSchemaModel from '../models/users.model.js';

export const register = async (req,res, next) => {
    try {
        const {fullName, email , password} = req.body;
        if(!fullName, !email, !password) {
            res.status(400).send('Please fill all the required fields...');
        }
        else {
            const isAlreadyExists = await  UserSchemaModel.findOne({email}); 
            if(isAlreadyExists) {
                res.status(400).send('User Already Exists...');
            }
            else {
                const newUser = new UserSchemaModel({fullName , email});

                bcryptjs.hash(password, 10 , (err, hashedpassword) => {
                    newUser.set('password', hashedpassword);
                    newUser.save();
                    next(); 
                })
                return res.status(200).send('User registered successfully..');
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

export const login = async (req, res , next) => {
    try {
        const {email , password } = req.body;

        if(!email || !password) {
            res.status(400).send('Please fill all the required fields');
        }
        else {
            const user = await UserSchemaModel.findOne({email});
            if(!user) {
                res.status(400).send('User email or password is incorrect')
            } 
            else {
                const ValidateUser = await bcryptjs.compare(password, user.password);
                if(!ValidateUser) {
                res.status(400).send('User email or password is incorrect');
                }
                else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
                    jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: 846000} , async (err, token)=> {
                        await UserSchemaModel.updateOne({_id: user._id}, {
                            $set: { token }
                        });
                        user.save();
                        return res.status(200).json({user: {id:user._id, email: user.email , fullName: user.fullName } , token: token});
                    });
                }
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

export const fetch = async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await UserSchemaModel.find({_id: {$ne: userId}});
        const userData = Promise.all(users.map(async (user) => {
            return {user: {email: user.email , fullName: user.fullName,receiverId: user._id } };
        }))
        res.status(200).json(await userData);
    }
    catch(err) {
        console.log(err);
    }
}