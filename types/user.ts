export interface UserContact {
  phone: string;
  address: string;
  country: string;
  city: string;
}

export enum UserRole {
  USER = "customer",
  SUPPLIER = "supplier",
  ADMIN = "admin",
}

export interface CreateUserDto {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  contact: UserContact;
}

export interface UpdateUserDto {
  id: string;
  email: string;
  name: string;
  contact: UserContact;
}

export interface DeleteUserDto {
  id: string;
}

export interface FindUserDto {
  id: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  contact: UserContact | null;
  status: string;
  role: UserRole;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  supplierDetails?: SupplierDetails;
}

export interface SupplierDetails {
  businessName?: string;
  businessType?: string;
  taxId?: string;
  establishedYear?: string;
  numberOfEmployees?: string;
  website?: string;

  contactPersonName?: string;
  contactEmail?: string;
  contactPhone?: string;
  street?: string;
  building?: string;
  city?: string;
  country?: string;

  isVerified?: boolean;

  businessDescription?: string;
  specializations?: string[];

  licenseType?: string;
  licenseNumber?: string;
  uploadedFiles?: string[];
}
