import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const triggerSOS = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, location, guestName, userId } = req.body;

    let nameToUse = guestName || 'Anonymous Citizen';
    let emergencyContacts: any[] = [];
    let medicalInfo: any = null;

    // If a logged-in user triggered it
    if (userId) {
      const userObj = await prisma.user.findUnique({ where: { id: userId } });
      if (userObj) {
        nameToUse = userObj.name;
        emergencyContacts = userObj.emergencyContacts ? JSON.parse(userObj.emergencyContacts) : [];
        medicalInfo = userObj.medicalInfo ? JSON.parse(userObj.medicalInfo) : null;
      }
    }

    const savedIncident = await prisma.incident.create({
      data: {
        userId: userId || undefined,
        guestName: userId ? undefined : nameToUse,
        category,
        locationLat: location.lat,
        locationLng: location.lng,
        locationAddress: location.address || 'Unknown coordinates',
        locationUpdatedAt: new Date(),
        status: 'pending',
        severity: 'critical',
        medicalInfo: medicalInfo ? JSON.stringify(medicalInfo) : null
      }
    });

    const trackingLink = `http://localhost:3000/tracking/${savedIncident.id}`;
    const timestamp = new Date().toLocaleString();

    const messageContent = `Emergency Alert!
${nameToUse} may need assistance.
Location:
${trackingLink}
Time:
${timestamp}
Please contact them immediately.
${medicalInfo && medicalInfo.bloodGroup ? '\nBlood Group: ' + medicalInfo.bloodGroup : ''}
${medicalInfo && medicalInfo.allergies ? 'Allergies: ' + medicalInfo.allergies : ''}`;

    // Simulate sending alerts through SMS, WhatsApp, Email
    const simulatedAlerts = emergencyContacts.map((contact: any) => {
      console.log(`[SMS & WHATSAPP SENT TO ${contact.mobile}]`);
      console.log(messageContent);
      return {
        contactName: contact.name,
        relationship: contact.relationship,
        channelSMS: { to: contact.mobile, status: 'SENT_SUCCESS', message: messageContent },
        channelWhatsApp: { to: contact.mobile, status: 'SENT_SUCCESS', message: messageContent },
      };
    });

    res.status(201).json({
      message: 'SOS Activated. Alerts dispatched to emergency contacts.',
      incident: savedIncident,
      simulatedAlerts: simulatedAlerts.length > 0 ? simulatedAlerts : [{
        contactName: 'Local Emergency Cell',
        relationship: 'Public Authority',
        channelSMS: {
          to: '112',
          status: 'SENT_SUCCESS',
          message: messageContent
        }
      }]
    });
  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ message: 'Failed to record SOS and send alerts.', error: String(error) });
  }
};

export const updateLiveLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { incidentId, location } = req.body;
    const incident = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        locationLat: location.lat,
        locationLng: location.lng,
        locationUpdatedAt: new Date()
      }
    });
    res.json({ message: 'Location updated', incident });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update location', error: String(error) });
  }
};

export const getLiveTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, mobile: true }
        }
      }
    });
    if (!incident) {
      res.status(404).json({ message: 'Tracking session not found or expired.' });
      return;
    }
    // Transform to match the old shape for frontend compatibility
    res.json({
      ...incident,
      location: {
        lat: incident.locationLat,
        lng: incident.locationLng,
        address: incident.locationAddress,
        lastUpdated: incident.locationUpdatedAt
      },
      medicalInfo: incident.medicalInfo ? JSON.parse(incident.medicalInfo) : null,
      _id: incident.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tracking info', error: String(error) });
  }
};

export const getMyIncidents = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: 'User session required to fetch history.' });
      return;
    }

    const incidents = await prisma.incident.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });
    res.json(incidents);
  } catch (error) {
    console.error('Fetch incidents error:', error);
    res.status(500).json({ message: 'Error retrieving incident history.', error: String(error) });
  }
};
