import { HydratedDocument } from 'mongoose';
import User from '../typings/User';

// Converts a User's chest_submitted Map to Record<String, boolean>
export const createChestSubmittedChecklist = (user: HydratedDocument<User>) => {
  const chestKeyValues = user.chests_submitted.keys();
  const chestSubmittedChecklist: Record<string, boolean> = {};

  for (const key of chestKeyValues) {
    chestSubmittedChecklist[key] = true;
  }

  return chestSubmittedChecklist;
}