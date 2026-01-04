// Mock authentication data and functions
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'supplier' | 'admin' | 'support';
  contact?: {
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  status: 'active' | 'pending' | 'suspended';
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

// Mock current user data
export const mockCurrentUser: User = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Yeabsira Moges',
  email: 'yeabsira.moges@2sv.org',
  role: 'admin',
  contact: {
    phone: '+251911234567',
    address: '123 Main Street',
    city: 'Addis Ababa',
    country: 'Ethiopia'
  },
  status: 'active',
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en'
  },
  createdAt: '2024-01-15T08:00:00.000Z',
  updatedAt: '2024-12-19T10:30:00.000Z',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
};

// Mock auth functions
export const getCurrentUser = (): User => {
  return mockCurrentUser;
};

export const logout = (): void => {
  // In a real app, this would clear tokens, redirect to login, etc.
  console.log('User logged out');
  // For demo purposes, just reload the page
  window.location.reload();
};

export const updateUser = (updates: Partial<User>): Promise<User> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      Object.assign(mockCurrentUser, updates);
      mockCurrentUser.updatedAt = new Date().toISOString();
      resolve(mockCurrentUser);
    }, 1000);
  });
};