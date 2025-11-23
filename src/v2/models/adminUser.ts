import { Schema, model } from 'mongoose';
import { AdminUser } from '../typings/AdminUser';

const adminUserSchema = new Schema<AdminUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: ['admin', 'business'], default: ['business'] },
  deleted: { type: Boolean, default: false},
}, { timestamps: true });

const AdminUserModel = model('AdminUser', adminUserSchema);

export default AdminUserModel;