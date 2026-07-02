import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
  email: string;
}

export interface IMedicalInfo {
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
}

export interface IUser extends Document {
  name: string;
  aadhaar?: string;
  mobile: string;
  email: string;
  dob: Date;
  gender: string;
  address: string;
  state: string;
  district: string;
  passwordHash: string;
  profilePhoto?: string;
  medicalInfo: IMedicalInfo;
  emergencyContacts: IEmergencyContact[];
  role: 'citizen' | 'admin';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  aadhaar: { type: String },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  passwordHash: { type: String, required: true },
  profilePhoto: { type: String },
  medicalInfo: {
    bloodGroup: { type: String, default: '' },
    allergies: { type: String, default: '' },
    conditions: { type: String, default: '' }
  },
  emergencyContacts: {
    type: [{
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true }
    }],
    default: []
  },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
