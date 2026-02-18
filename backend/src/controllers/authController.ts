import { Request, Response } from "express";
import { User } from "../models/User";
import { Session } from "../models/Session";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res
            .status(400)
            .json({ message: "Name, email, and password are required." });

        }

        //check if user exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user
        const user = new User ({name, email, password: hashedPassword });
        await user.save();

        // respond
        res.status(201).json({
            usr: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            message: "User registered successfully.",
        });
    } catch {
        res.status(500).json({ message: "Sever error", error});
    }
}