import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createMissingReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age, gender, dateMissing, lastSeenLocation, description, contactNumber } = req.body;
    const file = req.file;

    if (!name || !age || !gender || !dateMissing || !lastSeenLocation || !contactNumber) {
      res.status(400).json({ message: 'Missing mandatory registration fields.' });
      return;
    }

    const saved = await prisma.missingPerson.create({
      data: {
        name,
        age: parseInt(age, 10),
        gender,
        dateMissing: new Date(dateMissing),
        lastSeenLocation,
        description: description || '',
        contactNumber,
        photoUrl: file ? `/uploads/${file.filename}` : '',
        status: 'missing'
      }
    });

    res.status(201).json({
      message: 'Missing person report registered in civil records. Poster files are available to print.',
      report: saved
    });
  } catch (error) {
    console.error('Create missing report error:', error);
    res.status(500).json({ message: 'Failed to register missing person case.', error: String(error) });
  }
};

export const getMissingPeople = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await prisma.missingPerson.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(list);
  } catch (error) {
    console.error('List missing error:', error);
    res.status(500).json({ message: 'Error retrieving active missing reports.', error: String(error) });
  }
};

export const getSingleMissingCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await prisma.missingPerson.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ message: 'Report folder not found.' });
      return;
    }
    res.json(item);
  } catch (error) {
    console.error('Get single missing error:', error);
    res.status(500).json({ message: 'Error retrieving case details.', error: String(error) });
  }
};
