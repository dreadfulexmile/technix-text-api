const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUserName, createUser, updateRefreshToken, clearRefreshToken, findUserByRefreshToken } = require('../models/user.model.js');

const register = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        findUserByUserName(userName, async (err, existingUser) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                createUser(
                    { userName, password: hashedPassword },
                    (err, userId) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error creating user', error: err.message });
                        }

                        res.status(201).json({
                            message: 'User registered successfully',
                            userId
                        });
                    }
                );
            } catch (hashErr) {
                res.status(500).json({ message: 'Error hashing password', error: hashErr.message });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        findUserByUserName(userName, async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            try {
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }

                const accessToken = jwt.sign(
                    { userID: user.userID, userName: user.userName },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );

                const refreshToken = jwt.sign(
                    { userID: user.userID, userName: user.userName },
                    process.env.JWT_REFRESH_SECRET,
                    { expiresIn: '7d' }
                );

                updateRefreshToken(user.userID, refreshToken, (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ message: 'Error storing refresh token', error: updateErr.message });
                    }

                    res.status(200).json({
                        message: 'Login successful',
                        accessToken,
                        refreshToken,
                        user: {
                            userID: user.userID,
                            userName: user.userName
                        }
                    });
                });
            } catch (compareErr) {
                res.status(500).json({ message: 'Error verifying password', error: compareErr.message });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            findUserByRefreshToken(refreshToken, (dbErr, user) => {
                if (dbErr) {
                    return res.status(500).json({ message: 'Database error', error: dbErr.message });
                }

                if (!user) {
                    return res.status(403).json({ message: 'Refresh token not found' });
                }

                const newAccessToken = jwt.sign(
                    { userID: user.userID, userName: user.userName },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );

                res.status(200).json({
                    message: 'Token refreshed successfully',
                    accessToken: newAccessToken
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Token refresh failed', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            clearRefreshToken(decoded.userID, (clearErr) => {
                if (clearErr) {
                    return res.status(500).json({ message: 'Error clearing refresh token', error: clearErr.message });
                }

                res.status(200).json({ message: 'Logout successful' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout
};
