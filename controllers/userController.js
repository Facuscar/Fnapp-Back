import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";
import { registerEmail, recoverPassword } from "../helpers/emails.js";

export const receiveEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        const error = new Error('Email is missing');
        return res.status(400).json({msg: error.message});
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.json ({ msg: 'New user' });
        return;
    }
    
    res.json({ 
        msg: 'Existing user', 
        user: { 
            name: user.name, 
            email,
        },
    })
}

export const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        const error = new Error('One or more fields are missing');
        return res.status(400).json({ msg: error.message });
    }

    const dbUser = await User.findOne({ email });

    if (dbUser) {
        const error = new Error('User already registered');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = generateId();
        await user.save();

        registerEmail({ 
            email: user.email,
            name: user.name,
            token: user.token,
        });

        res.json({ msg: 'Account created successfully, check your email to confirm it', success: true });
    } catch (e) {
        console.log(e);
        const error = new Error('Internal server error');
        return res.status(500).json({ msg: error.message });
    }
}

export const authUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
        const error = new Error('The user does not exist');
        return res.status(404).json({msg: error.message});
    }

    if (!user.confirmed) {
        const error = new Error('Your account is not confirmed yet');
        return res.status(403).json({msg: error.message});
    }

    if (!await user.verifyPassword(password)) {
        const error = new Error('Your password and email do not match');
        return res.status(404).json({msg: error.message});
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateJWT(user._id),
    })
}

export const confirm = async (req, res) => {
    const { token } = req.params;
    console.log(token);
    const user = await User.findOne({ token });
    if (!user) {
        const error = new Error('Invalid token');
        return res.status(403).json({ msg: error.message });
    }

    try {
        user.confirmed = true;
        user.token = null;
        await user.save();
        res.json({ msg: 'User confirmed successfully'});
    } catch (e) {
        console.log(e);

        const error = new Error('Internal server error');
        return res.status(400).json({ msg: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('Email not found');
        return res.status(404).json({ msg: error.message });
    }

    try {
        user.token = generateId();
        await user.save();

        recoverPassword({ 
            email: user.email,
            name: user.name,
            token: user.token,
        });

        res.json({ msg: 'We sent an email to your inbox with the instructions' })
    } catch (e) {
      console.log(e);

      const error = new Error('Internal server error');
      return res.status(400).json({ msg: error.message });
  }
}

export const verifyToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ token }); 

    if (!user) {
        const error = new Error('Invalid token');
        return res.status(403).json({ msg: error.message });
    }

    return res.json({ msg: 'Token valid' });
}

export const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
        const error = new Error('Invalid token');
        return res.status(403).json({ msg: error.message });
    }

    if (await user.verifyPassword(password)) {
        const error = new Error('Your new password can\'t be the same as the old one');
        return res.status(404).json({msg: error.message});
    }

    user.password = password;
    user.token = null;
    try {
        await user.save();
        res.json({msg: 'Password modified successfully'});
    } catch (e) {
      console.log(e);

      const error = new Error('Internal server error');
      return res.status(400).json({ msg: error.message });
  }
}

export const profile = async (req, res) => {
    const { user } = req;

    res.json(user);
}
