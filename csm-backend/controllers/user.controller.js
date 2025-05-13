const User = require('../models/user.model');

/**
 * Get user profile controller
 * 
 * No request body needed - uses authenticated user from JWT
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware after token verification
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Format user data to match User interface
    const userData = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    
    res.json(userData);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get user profile controller
 * 
 * No request body needed - uses authenticated user from JWT
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware after token verification
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Format user data to match User interface
    const userData = {
      id: user._id.toString(), // Convert ObjectId to string
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    
    res.json(userData);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update user profile controller
 * 
 * Expected request format (all fields optional):
 * {
 *   fullName?: string
 *   email?: string
 * }
 */
exports.updateProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware after token verification
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Extract only allowed updatable fields
    const { fullName, email } = req.body;
    const updates = {};
    
    // Only add defined fields to updates
    if (fullName !== undefined) updates.fullName = fullName;
    if (email !== undefined) {
      // Check if email already exists for another user
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already used by another account' });
        }
      }
      updates.email = email;
    }
    
    // Don't process empty updates
    if (Object.keys(updates).length === 0) {
      const user = await User.findById(req.user.id).select('-password');
      
      // Format and return current user data
      const userData = {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role
      };
      
      return res.json(userData);
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updates, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Format user data to match User interface
    const userData = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    
    res.json(userData);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};