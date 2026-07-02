import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  user?: mongoose.Types.ObjectId;
  guestName?: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: Date;
  status: 'pending' | 'resolved' | 'dispatched';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const IncidentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  guestName: { type: String, default: 'Anonymous Citizen' },
  category: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: '' }
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'resolved', 'dispatched'], default: 'pending' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' }
}, {
  timestamps: true
});

export default mongoose.model<IIncident>('Incident', IncidentSchema);
