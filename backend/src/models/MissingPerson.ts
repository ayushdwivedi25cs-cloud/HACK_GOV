import mongoose, { Schema, Document } from 'mongoose';

export interface IMissingPerson extends Document {
  name: string;
  age: number;
  gender: string;
  dateMissing: Date;
  lastSeenLocation: string;
  photoUrl?: string;
  description?: string;
  contactNumber: string;
  status: 'missing' | 'found';
  createdAt: Date;
}

const MissingPersonSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  dateMissing: { type: Date, required: true },
  lastSeenLocation: { type: String, required: true },
  photoUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  contactNumber: { type: String, required: true },
  status: { type: String, enum: ['missing', 'found'], default: 'missing' }
}, {
  timestamps: true
});

export default mongoose.model<IMissingPerson>('MissingPerson', MissingPersonSchema);
