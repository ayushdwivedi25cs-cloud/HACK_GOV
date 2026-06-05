import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllIncidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        user: {
          select: { name: true, mobile: true, email: true, medicalInfo: true }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Transform user.medicalInfo from JSON string for each incident
    const transformed = incidents.map(inc => ({
      ...inc,
      _id: inc.id,
      location: {
        lat: inc.locationLat,
        lng: inc.locationLng,
        address: inc.locationAddress,
        lastUpdated: inc.locationUpdatedAt
      },
      user: inc.user ? {
        ...inc.user,
        medicalInfo: inc.user.medicalInfo ? JSON.parse(inc.user.medicalInfo) : null
      } : null
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching all incidents:', error);
    res.status(500).json({ message: 'Error retrieving active incidents list.', error: String(error) });
  }
};

export const updateIncidentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, severity } = req.body;

    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      res.status(404).json({ message: 'Incident report not found.' });
      return;
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(severity ? { severity } : {})
      }
    });

    res.json({ message: 'Incident updated successfully.', incident: updated });
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ message: 'Failed to update incident report.', error: String(error) });
  }
};

export const getIncidentAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allIncidents = await prisma.incident.findMany();

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
      lat: inc.locationLat,
      lng: inc.locationLng,
      category: inc.category,
      severity: inc.severity,
      id: inc.id
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
