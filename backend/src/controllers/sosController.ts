import { Request, Response } from 'express';
import Incident from '../models/Incident';
import User from '../models/User';

export const triggerSOS = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, location, guestName, userId } = req.body;

    let userObj = null;
    let nameToUse = guestName || 'Anonymous Citizen';
    let emergencyContacts: any[] = [];

    // If a logged-in user triggered it
    if (userId) {
      userObj = await User.findById(userId);
      if (userObj) {
        nameToUse = userObj.name;
        emergencyContacts = userObj.emergencyContacts;
      }
    }

    const newIncident = new Incident({
      user: userId || undefined,
      guestName: userId ? undefined : nameToUse,
      category,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address || 'Unknown coordinates'
      },
      status: 'pending',
      severity: 'critical' // SOS alerts are automatically critical severity
    });

    const savedIncident = await newIncident.save();

    // Simulate sending alerts through SMS, WhatsApp, Email, and Push Notifications
    const simulatedAlerts = emergencyContacts.map(contact => {
      const messageContent = `🚨 EMERGENCY ALERT 🚨\nName: ${nameToUse}\nType: ${category}\nLive Location: https://maps.google.com/?q=${location.lat},${location.lng}\nTime: ${new Date().toLocaleString()}\nEmergency ID: ${savedIncident._id}`;
      
      return {
        contactName: contact.name,
        relationship: contact.relationship,
        channelSMS: {
          to: contact.mobile,
          status: 'SENT_SUCCESS',
          message: messageContent
        },
        channelWhatsApp: {
          to: contact.mobile,
          status: 'SENT_SUCCESS',
          message: messageContent
        },
        channelEmail: {
          to: contact.email,
          status: 'SENT_SUCCESS',
          subject: `🚨 Emergency Alert for ${nameToUse}`,
          message: messageContent
        }
      };
    });

    res.status(201).json({
      message: 'SOS Activated. Alerts dispatched to emergency contacts and local emergency cells.',
      incident: savedIncident,
      simulatedAlerts: simulatedAlerts.length > 0 ? simulatedAlerts : [{
        contactName: 'Local Emergency Cell & Authority Dispatch',
        relationship: 'Public Authority',
        channelSMS: {
          to: '112 / Emergency Control Room',
          status: 'SENT_SUCCESS',
          message: `🚨 GUEST EMERGENCY ALERT 🚨\nType: ${category}\nLocation: Lat ${location.lat}, Lng ${location.lng}\nEmergency ID: ${savedIncident._id}`
        }
      }]
    });
  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ message: 'Failed to record SOS and send alerts.', error: String(error) });
  }
};

export const getMyIncidents = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: 'User session required to fetch history.' });
      return;
    }

    const incidents = await Incident.find({ user: userId }).sort({ timestamp: -1 });
    res.json(incidents);
  } catch (error) {
    console.error('Fetch incidents error:', error);
    res.status(500).json({ message: 'Error retrieving incident history.', error: String(error) });
  }
};
