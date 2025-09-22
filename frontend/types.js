// Relationship options
export const Relationship = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  FATHER: 'Father',
  MOTHER: 'Mother',
  BROTHER: 'Brother',
  SISTER: 'Sister',
  GRANDSON: 'Grandson',
  GRANDDAUGHTER: 'Granddaughter',
  OTHER: 'Other'
};

// Marital status options
export const MaritalStatus = {
  SINGLE: 'Single',
  MARRIED: 'Married',
  DIVORCED: 'Divorced',
  WIDOWED: 'Widowed'
};

// Gender options
export const Gender = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
};

// Blood group options
export const BloodGroup = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-'
};

// Occupation options
export const Occupation = {
  BUSINESS: 'Business',
  SERVICE: 'Service',
  STUDENT: 'Student',
  HOMEMAKER: 'Homemaker',
  OTHER: 'Other'
};

// Sample structure for a Member object
export const sampleMember = {
  id: '',
  name: '',
  relationship_to_head: Relationship.SON,
  marital_status: MaritalStatus.SINGLE,
  dob: '',
  doa: '',
  occupation: Occupation.STUDENT,
  occupation_details: '',
  spouse_name: '',
  mobile: '',
  email: '',
  gender: Gender.MALE,
  blood_group: BloodGroup.A_POSITIVE,
  photo_url: '',
  photo_base64: ''
};

// Sample structure for a Family object
export const sampleFamily = {
  id: '',
  head_name: '',
  head_mobile: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: '',
  block: '',
  flat_no: '',
  occupation: Occupation.SERVICE,
  occupation_details: '',
  email: '',
  members: [],
  status: 'PENDING' // or 'APPROVED', 'REJECTED'
};

// Sample structure for an Announcement
export const sampleAnnouncement = {
  id: '',
  message: '',
  timestamp: '',
  state: '',
  city: ''
};

// Admin permissions structure
export const sampleAdminPermissions = {
  can_approve_reject: false,
  can_delete_families: false,
  can_send_announcements: false,
  can_manage_admins: false
};

// Admin roles
export const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUB_ADMIN: 'SUB_ADMIN'
};

// Sample structure for an AdminUser
export const sampleAdminUser = {
  id: '',
  mobile: '',
  name: '',
  role: AdminRole.SUB_ADMIN,
  permissions: sampleAdminPermissions,
  state: '',
  city: ''
};

// Sample structure for a FilteredMember
export const sampleFilteredMember = {
  ...sampleMember,
  family_head_name: '',
  family_head_mobile: '',
  city: '',
  state: ''
};

// Member filter options
export const sampleMemberFilters = {
  eventType: 'all', // 'birthdays' | 'anniversaries' | 'all'
  dateFrom: '',
  dateTo: '',
  maritalStatus: 'all', // 'married' | 'unmarried' | 'all'
  minAge: null,
  maxAge: null,
  state: '',
  city: '',
  nameQuery: ''
};
