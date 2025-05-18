const Users = require('../model/users')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const maxage = 24 * 60 * 60

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: maxage });
};

const checkAuth = (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        return res.status(200).json({ id: decodedToken.id, role: decodedToken.role });
    });
};

const create = async (req, res) => {
    const { username, phonenumber, email, password } = req.body
    let errorMessage = {};
    if (!username) errorMessage.username = "Username required!"
    if (!phonenumber) errorMessage.phonenumber = "Phonenumber required!"
    if (!email) errorMessage.email = "Email required!"
    if (!password) errorMessage.password = "Email required!"

    if (Object.keys(errorMessage).length > 0) {
        return res.json({ errorMessage })
    }

    try {
        const duplicateCheck = await Users.isDuplicate({ username, phonenumber, email })
        if (duplicateCheck.length > 0) {
            console.log(duplicateCheck)
            return res.json({ status: "error", duplicateFound: duplicateCheck })
        }
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(password, salt)

        const user = new Users({
            username,
            phonenumber,
            email,
            role: ["user"],
            password: hashedpassword
        })

        try {
            await user.validate()
        } catch (error) {
            for (const key of error.errors) {
                errorMessage[key] = error.errors[key].message
            }
        }
        if (Object.keys(errorMessage).length > 0) {
            return res.json({ errorMessage })
        }
        await user.save()
        res.status(200).json({ msg: "User create successfully!" })
    } catch (error) {
        console.log(error)
    }

}

const login = async (req, res) => {
    const { email, password, option } = req.body;

    const { user, error } = await Users.loginByOption(option, email, password);

    if (error) {
        return res.json({ error });
    }

    const token = createToken(user._id, user.role);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxage * 1000 });
    res.status(200).json({ status: "success", message: "Login successful", user });
};


const update = async (req, res) => {
    const { username, phonenumber, email } = req.body;
    const userid = req.params.id;

    if (!username) return res.status(400).json({ status: "error", msg: "Username required!" });
    if (!phonenumber) return res.status(400).json({ status: "error", msg: "Phonenumber required!" });
    if (!email) return res.status(400).json({ status: "error", msg: "Email required!" });
    if (!userid) return res.status(400).json({ status: "error", msg: "ID required!" });

    try {
        await Users.findByIdAndUpdate({ _id: userid },
            {
                $set: {
                    username,
                    phonenumber,
                    email,
                }
            }
        );
        res.status(200).json({ status: "success", msg: "User updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", msg: "Error updating user" });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        await Users.findByIdAndDelete(id)
        res.status(200).json({ status: "success", msg: "User deleted successfully!" })
    } catch (error) {
        console.log(error.message)
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id
    try {
        const user = await Users.findOne({ _id: id })
        res.status(200).json({ status: "success", data:user })
    } catch (error) {
        console.log(error.message)
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({})
        res.status(200).json({ status: "success", data: users })
    } catch (error) {
        console.log(error.message)
    }
}

const removeRole = async (req, res) => {
    const { id, role } = req.params
    if (!["admin", "manager", "chef"].includes(role)) {
        return res.json({ status: "role", message: "Invalid role!" });
    }

    try {
        // Find the user by email or phone
        const user = await Users.findOne({
            _id: id
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Users.updateOne(
            { _id: user._id },
            { $pull: { role: role } }
        );

        return res.status(200).json({ message: `${role} role removed from user[${id}]` });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// In your user controller file (e.g., controllers/userController.js)
const addRole = async (req, res) => {
    const { roleName, id } = req.params;

    if (!roleName || !id) {
        return res.status(400).json({ status: "error", message: "Role name and user ID are required." });
    }

    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        if (user.role.includes(roleName)) {
            return res.status(409).json({ status: "error", message: `User already has the '${roleName}' role.` });
        }

        user.role.push(roleName);
        await user.save();

        res.status(200).json({ status: "success", message: `'${roleName}' role added to user.` });
    } catch (error) {
        console.error("Error adding role:", error);
        res.status(500).json({ status: "error", message: "Error adding role." });
    }
};

const logout = (req, res) => {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax" });
    res.status(200).json({ message: "Logged out successfully" });
};

const UserByRole = async (req, res) => {
    const { role } = req.params;

    try {
        const users = await Users.find({ role: role });
        res.status(200).json({
            length: users.length,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users by role:", error.message);
        res.status(500).json({ error: "Failed to fetch users by role" });
    }
};

module.exports = {
    create,
    login,
    update,
    deleteUser,
    getUserById,
    addRole,
    removeRole,
    getAllUsers,
    checkAuth,
    logout,
    UserByRole
}