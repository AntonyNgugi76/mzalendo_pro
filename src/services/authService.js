const User = require("../models/User");
const Company = require("../models/Company");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user,
    };
  }

  static async registerCompany(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const company = await Company.create({
      name: data.companyName,
    });

    const admin = await User.create({
      companyId: company._id,
      name: data.adminName,
      email: data.email,
      password: hashedPassword,
      role: "admin",
    });

    company.admin = admin._id;
    await company.save();

    return {
      company,
      admin,
    };
  }
}

module.exports = AuthService;
