import { Request, Response } from 'express';
import Incident from '../models/Incident';

export const getAllIncidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await Incident.find().populate('user', 'name mobile email medicalInfo').sort({ timestamp: -1 });
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching all incidents:', error);
    res.status(500).json({ message: 'Error retrieving active incidents list.', error: String(error) });
  }
};

export const updateIncidentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, severity } = req.body;

    const incident = await Incident.findById(id);
    if (!incident) {
      res.status(404).json({ message: 'Incident report not found.' });
      return;
    }

    if (status) incident.status = status;
    if (severity) incident.severity = severity;

    await incident.save();
    res.json({ message: 'Incident updated successfully.', incident });
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Failed to update incident report.', error: String(error) });
  }
};

export const getIncidentAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allIncidents = await Incident.find();

    // Aggregations
    const statusCounts = { pending: 0, dispatched: 0, resolved: 0 };
    const severityCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    const categoryCounts: Record<string, number> = {};

    allIncidents.forEach(inc => {
      // Status
      if (inc.status in statusCounts) {
        statusCounts[inc.status as keyof typeof statusCounts]++;
      }
      // Severity
      if (inc.severity in severityCounts) {
        severityCounts[inc.severity as keyof typeof severityCounts]++;
      }
      // Category
      categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
    });

    // Formatting category breakdown for chart displays
    const categoryBreakdown = Object.keys(categoryCounts).map(key => ({
      name: key,
      value: categoryCounts[key]
    }));

    // Heatmap data formatting
    const heatmapPoints = allIncidents.map(inc => ({
      lat: inc.location.lat,
      lng: inc.location.lng,
      category: inc.category,
      severity: inc.severity,
      id: inc._id
    }));

    res.json({
      totalIncidents: allIncidents.length,
      statusCounts,
      severityCounts,
      categoryBreakdown,
      heatmapPoints
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({ message: 'Failed to gather analytics dashboards data.', error: String(error) });
  }
};
