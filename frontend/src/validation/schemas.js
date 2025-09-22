import { z } from 'zod';
import { Relationship, MaritalStatus, Gender, BloodGroup, Occupation } from '../../types';

export const phoneSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number.')
});

export const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits.')
});

export const headProfileSchema = z
  .object({
    head_name: z.string().min(3, 'Name must be at least 3 characters.'),
    occupation: z.nativeEnum(Occupation),
    occupation_details: z.string().optional(),
    email: z.string().email('Invalid email address.').optional().or(z.literal('')),
    address_line1: z.string().min(5, 'Address is required.'),
    address_line2: z.string().optional(),
    city: z.string().min(1, 'Please select a city.'),
    state: z.string().min(1, 'Please select a state.'),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid pincode.'),
    block: z.string().min(1, 'Block is required.'),
    flat_no: z.string().min(1, 'Flat/House No. is required.')
  })
  .refine(
    (data) =>
      ![Occupation.BUSINESS, Occupation.SERVICE].includes(data.occupation) ||
      (data.occupation_details && data.occupation_details.trim().length >= 5),
    {
      message: 'Business/Service details are required and must be at least 5 characters.',
      path: ['occupation_details']
    }
  );

export const memberSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    relationship_to_head: z.nativeEnum(Relationship),
    marital_status: z.nativeEnum(MaritalStatus),
    gender: z.nativeEnum(Gender),
    blood_group: z.nativeEnum(BloodGroup),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date of birth'
    }),
    doa: z.string().optional(),
    spouse_name: z.string().optional(),
    occupation: z.nativeEnum(Occupation),
    occupation_details: z.string().optional(),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Invalid 10-digit mobile number.').optional().or(z.literal('')),
    email: z.string().email('Invalid email address.').optional().or(z.literal('')),
    photo_base64: z.string().optional()
  })
  .refine((data) => data.marital_status !== MaritalStatus.MARRIED || (data.doa && data.doa.trim() !== ''), {
    message: 'Date of Anniversary is required for married members.',
    path: ['doa']
  })
  .refine(
    (data) =>
      data.marital_status !== MaritalStatus.MARRIED ||
      (data.spouse_name && data.spouse_name.trim().length >= 3),
    {
      message: 'Spouse name is required and must be at least 3 characters.',
      path: ['spouse_name']
    }
  )
  .refine(
    (data) =>
      ![Occupation.BUSINESS, Occupation.SERVICE].includes(data.occupation) ||
      (data.occupation_details && data.occupation_details.trim().length >= 5),
    {
      message: 'Business/Service details are required and must be at least 5 characters.',
      path: ['occupation_details']
    }
  );

export const adminFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number.'),
  state: z.string().optional(),
  city: z.string().optional(),
  permissions: z.object({
    can_approve_reject: z.boolean(),
    can_delete_families: z.boolean(),
    can_send_announcements: z.boolean(),
    can_manage_admins: z.boolean()
  })
});
