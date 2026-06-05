import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'hackgov-super-secret-key-12345';

export const registerCitizen = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      aadhaar,
      mobile,
      email,
      dob,
      gender,
      address,
      state,
      district,
      password,
      medicalInfo,
      emergencyContacts
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobile }]
      }
    });
    if (existingUser) {
      res.status(400).json({ message: 'A citizen with this email or mobile number already exists.' });
      return;
    }

    // Verify minimum of 3 emergency contacts
    if (!emergencyContacts || !Array.isArray(emergencyContacts) || emergencyContacts.length < 3) {
      res.status(400).json({ message: 'Safety regulations require a minimum of 3 emergency contacts to register.' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    await prisma.user.create({
      data: {
        name,
        aadhaar,
        mobile,
        email,
        dob: dob ? new Date(dob) : null,
        gender,
        address,
        state,
        district,
        passwordHash,
        medicalInfo: medicalInfo ? JSON.stringify(medicalInfo) : null,
        emergencyContacts: JSON.stringify(emergencyContacts),
        role: 'citizen'
      }
    });

    res.status(201).json({ message: 'Citizen registration completed successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration.', error: String(error) });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    // Admin login fallback for hackathon demonstration
    if (role === 'admin' && email === 'admin@hackgov.in' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'admin-id', role: 'admin', name: 'National Admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({
        token,
        user: {
          id: 'admin-id',
          name: 'National Admin',
          email: 'admin@hackgov.in',
          role: 'admin'
        }
      });
      return;
    }

    // Locate normal citizen
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials or user does not exist.' });
      return;
    }

    // Check if role matches
    if (role && user.role !== role) {
      res.status(400).json({ message: `Access denied. Selected role does not match user account type.` });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials.' });
      return;
    }

    // Issue JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        medicalInfo: user.medicalInfo ? JSON.parse(user.medicalInfo) : null,
        emergencyContacts: user.emergencyContacts ? JSON.parse(user.emergencyContacts) : [],
        state: user.state,
        district: user.district
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.', error: String(error) });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId || userId === 'admin-id') {
      res.status(400).json({ message: 'Invalid user session or Admin account requested.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'Citizen profile not found.' });
      return;
    }

    // Return user without passwordHash, parse JSON fields
    const { passwordHash: _ph, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      medicalInfo: user.medicalInfo ? JSON.parse(user.medicalInfo) : null,
      emergencyContacts: user.emergencyContacts ? JSON.parse(user.emergencyContacts) : []
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error retrieving profile information.', error: String(error) });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId || userId === 'admin-id') {
      res.status(400).json({ message: 'Invalid user session' });
      return;
    }

    const { medicalInfo, emergencyContacts } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        medicalInfo: medicalInfo ? JSON.stringify(medicalInfo) : undefined,
        emergencyContacts: emergencyContacts ? JSON.stringify(emergencyContacts) : undefined,
      }
    });

    const { passwordHash: _ph, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      medicalInfo: user.medicalInfo ? JSON.parse(user.medicalInfo) : null,
      emergencyContacts: user.emergencyContacts ? JSON.parse(user.emergencyContacts) : []
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile.', error: String(error) });
  }
};
