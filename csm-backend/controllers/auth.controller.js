const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Signup controller - handles user registration
 * 
 * Expected request format:
 * {
 *   fullName: string
 *   email: string
 *   password: string
 * }
 */
exports.signup = async (req, res) => {
  try {
    // Destructure only the fields defined in SignupData interface
    const { fullName, email, password } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields (fullName, email, password)'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already used' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      fullName, 
      email, 
      password: hashedPassword, 
      role: 'user' 
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Return user data and token matching the AuthResponse interface
    const userData = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    
    res.status(201).json({ 
      user: userData,
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login controller - handles user authentication
 * 
 * Expected request format:
 * {
 *   email: string
 *   password: string
 * }
 */
exports.login = async (req, res) => {
  try {
    // Destructure only the fields defined in LoginCredentials interface
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields (email, password)'
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Return user data and token matching the AuthResponse interface
    const userData = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    
    res.json({ 
      user: userData,
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};