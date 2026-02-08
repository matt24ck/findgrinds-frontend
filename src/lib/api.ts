const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Get auth token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Base fetch wrapper with auth
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ============ AUTH ============
export const auth = {
  login: (email: string, password: string) =>
    fetchAPI<{ success: boolean; data: { user: any; token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: { email: string; password: string; firstName: string; lastName: string; userType: string }) =>
    fetchAPI<{ success: boolean; data: { user: any; token: string } }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => fetchAPI<{ success: boolean; data: any }>('/api/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchAPI<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  forgotPassword: (email: string) =>
    fetchAPI<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    fetchAPI<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// ============ TUTORS ============
export const tutors = {
  search: (params: {
    subject?: string;
    level?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return fetchAPI<{ success: boolean; data: { items: any[]; total: number; page: number; totalPages: number } }>(
      `/api/tutors?${searchParams.toString()}`
    );
  },

  getById: (id: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/tutors/${id}`),

  getAvailability: (id: string) =>
    fetchAPI<{ success: boolean; data: { tutorId: string; slots: any[] } }>(`/api/tutors/${id}/availability`),

  getReviews: (id: string, page = 1) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/tutors/${id}/reviews?page=${page}`),

  getMe: () =>
    fetchAPI<{ success: boolean; data: any }>('/api/tutors/me'),

  getMyStats: () =>
    fetchAPI<{ success: boolean; data: { thisMonth: number; lastMonth: number; sessionsThisMonth: number; resourcesSoldThisMonth: number; sessionEarnings: number; resourceEarnings: number } }>(
      '/api/tutors/me/stats'
    ),
};

// ============ SESSIONS ============
export const sessions = {
  create: (data: {
    tutorId: string;
    subject: string;
    level: string;
    sessionType: string;
    scheduledAt: string;
    durationMins?: number;
  }) =>
    fetchAPI<{ success: boolean; data: any }>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/api/sessions'),

  getUpcoming: () => fetchAPI<{ success: boolean; data: any[] }>('/api/sessions?upcoming=true'),

  getById: (id: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/sessions/${id}`),

  cancel: (id: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/sessions/${id}/cancel`, {
      method: 'PUT',
    }),

  review: (id: string, rating: number, reviewText: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/sessions/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, reviewText }),
    }),
};

// ============ RESOURCES ============
export const resources = {
  search: (params: {
    subject?: string;
    level?: string;
    resourceType?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return fetchAPI<{ success: boolean; data: { items: any[]; total: number; page: number; totalPages: number } }>(
      `/api/resources?${searchParams.toString()}`
    );
  },

  getById: (id: string) =>
    fetchAPI<{ success: boolean; data: any }>(`/api/resources/${id}`),

  getPurchased: () =>
    fetchAPI<{ success: boolean; data: any[] }>('/api/resources/purchased'),

  purchase: (id: string) =>
    fetchAPI<{ url: string; purchaseId: string }>(`/api/resources/${id}/purchase`, {
      method: 'POST',
    }),

  checkOwnership: (id: string) =>
    fetchAPI<{ success: boolean; data: { owned: boolean; purchasedAt: string | null } }>(
      `/api/resources/${id}/ownership`
    ),

  download: (id: string) =>
    fetchAPI<{ success: boolean; data: { downloadUrl: string; title: string; resourceType: string } }>(
      `/api/resources/${id}/download`
    ),

  create: (data: {
    title: string;
    description: string;
    fileKey: string;
    previewKey?: string;
    resourceType: string;
    subject: string;
    level: string;
    price: number;
  }) =>
    fetchAPI<{ success: boolean; data: any }>('/api/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  report: (id: string, reason: string, details?: string) =>
    fetchAPI<{ success: boolean; message: string }>(`/api/resources/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    }),

  reportStatus: (id: string) =>
    fetchAPI<{ success: boolean; data: { reported: boolean } }>(`/api/resources/${id}/report-status`),

  delete: (id: string) =>
    fetchAPI<{ success: boolean; message: string }>(`/api/resources/${id}`, {
      method: 'DELETE',
    }),
};

// ============ PAYMENTS ============
export const payments = {
  createIntent: (sessionId: string, amount: number) =>
    fetchAPI<{ success: boolean; data: { clientSecret: string; paymentIntentId: string } }>(
      '/api/payments/create-intent',
      {
        method: 'POST',
        body: JSON.stringify({ sessionId, amount }),
      }
    ),

  confirm: (paymentIntentId: string, sessionId: string) =>
    fetchAPI<{ success: boolean; data: any }>('/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, sessionId }),
    }),

  history: (page = 1) =>
    fetchAPI<{ success: boolean; data: { items: any[]; total: number } }>(
      `/api/payments/history?page=${page}`
    ),
};

// ============ AVAILABILITY ============
export const availability = {
  getStatus: () =>
    fetchAPI<{ hasWeeklySlots: boolean; slotCount: number; mediaConfigured: string[] }>(
      '/api/availability/status'
    ),

  getWeekly: (tutorId: string) =>
    fetchAPI<{ success: boolean; data: any[] }>(`/api/availability/${tutorId}/weekly`),

  setWeekly: (slots: { dayOfWeek: number; startTime: string; medium: string }[]) =>
    fetchAPI<{ success: boolean; count: number }>('/api/availability/weekly', {
      method: 'PUT',
      body: JSON.stringify({ slots }),
    }),

  getOverrides: (tutorId: string, startDate: string, endDate: string) =>
    fetchAPI<{ success: boolean; data: any[] }>(
      `/api/availability/${tutorId}/overrides?startDate=${startDate}&endDate=${endDate}`
    ),

  setOverrides: (overrides: { date: string; startTime: string; medium: string; isAvailable: boolean }[]) =>
    fetchAPI<{ success: boolean; count: number }>('/api/availability/overrides', {
      method: 'PUT',
      body: JSON.stringify({ overrides }),
    }),

  deleteOverrides: (ids: string[]) =>
    fetchAPI<{ success: boolean; deleted: number }>('/api/availability/overrides', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    }),

  getSlots: (tutorId: string, params: { medium: string; startDate: string; endDate: string }) => {
    const searchParams = new URLSearchParams(params);
    return fetchAPI<{ success: boolean; data: any[] }>(
      `/api/availability/${tutorId}/slots?${searchParams.toString()}`
    );
  },
};

// ============ STRIPE ============
export const stripeApi = {
  checkoutSubscription: (tier: string) =>
    fetchAPI<{ url: string }>('/api/stripe/checkout/subscription', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    }),
  getMySubscription: () =>
    fetchAPI<{ tier: string | null }>('/api/stripe/subscription/me'),
  cancelSubscription: () =>
    fetchAPI<{ message: string }>('/api/stripe/subscription/cancel', {
      method: 'POST',
    }),
};

// ============ PARENT ============
export const parentApi = {
  generateCode: () =>
    fetchAPI<{ success: boolean; data: { code: string; expiresAt: string; isExisting: boolean } }>(
      '/api/parent/generate-code',
      { method: 'POST' }
    ),

  getMyCode: () =>
    fetchAPI<{ success: boolean; data: { pendingCode: { code: string; expiresAt: string } | null; linkedParents: { linkId: string; parentName: string; linkedAt: string }[] } }>(
      '/api/parent/my-code'
    ),

  linkStudent: (code: string) =>
    fetchAPI<{ success: boolean; data: { studentId: string; studentName: string; linkedAt: string } }>(
      '/api/parent/link',
      { method: 'POST', body: JSON.stringify({ code }) }
    ),

  getStudents: () =>
    fetchAPI<{ success: boolean; data: { linkId: string; studentId: string; firstName: string; lastName: string; email: string; profilePhotoUrl: string | null; linkedAt: string }[] }>(
      '/api/parent/students'
    ),

  getStudentDashboard: (studentId: string) =>
    fetchAPI<{ success: boolean; data: { sessions: any[]; resources: any[]; summary: { totalSpent: number; upcomingSessionCount: number; completedSessionCount: number; resourceCount: number } } }>(
      `/api/parent/students/${studentId}/dashboard`
    ),

  unlinkStudent: (studentId: string) =>
    fetchAPI<{ success: boolean }>(`/api/parent/students/${studentId}`, {
      method: 'DELETE',
    }),

  getStudentMessages: (studentId: string) =>
    fetchAPI<{ success: boolean; data: any[] }>(
      `/api/parent/students/${studentId}/messages`
    ),

  getStudentConversation: (studentId: string, conversationId: string, page = 1) =>
    fetchAPI<{ success: boolean; data: { conversation: any; messages: any[]; total: number; page: number; totalPages: number } }>(
      `/api/parent/students/${studentId}/messages/${conversationId}?page=${page}`
    ),

  sendOnBehalf: (studentId: string, conversationId: string, message: string) =>
    fetchAPI<{ success: boolean; data: any }>(
      `/api/parent/students/${studentId}/messages/${conversationId}`,
      { method: 'POST', body: JSON.stringify({ message }) }
    ),

  startConversationOnBehalf: (studentId: string, tutorId: string, message: string) =>
    fetchAPI<{ success: boolean; data: { conversationId: string; isExisting: boolean } }>(
      `/api/parent/students/${studentId}/messages`,
      { method: 'POST', body: JSON.stringify({ tutorId, message }) }
    ),
};

// ============ UPLOAD ============
export const upload = {
  getProfilePhotoUrl: (fileName: string, contentType: string) =>
    fetchAPI<{ success: boolean; data: { uploadUrl: string; key: string } }>(
      '/api/upload/profile-photo',
      { method: 'POST', body: JSON.stringify({ fileName, contentType }) }
    ),

  confirmProfilePhoto: (key: string) =>
    fetchAPI<{ success: boolean; data: { key: string; displayUrl: string } }>(
      '/api/upload/profile-photo/confirm',
      { method: 'PUT', body: JSON.stringify({ key }) }
    ),

  getGardaDocumentUrl: (fileName: string, contentType: string) =>
    fetchAPI<{ success: boolean; data: { uploadUrl: string; key: string } }>(
      '/api/upload/garda-document',
      { method: 'POST', body: JSON.stringify({ fileName, contentType }) }
    ),

  getResourceUrl: (fileName: string, contentType: string) =>
    fetchAPI<{ success: boolean; data: { uploadUrl: string; key: string } }>(
      '/api/upload/resource',
      { method: 'POST', body: JSON.stringify({ fileName, contentType }) }
    ),

  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
  },
};

// ============ MESSAGES ============
export const messages = {
  getConversations: () =>
    fetchAPI<{ success: boolean; data: any[] }>('/api/messages/conversations'),

  getMessages: (conversationId: string, page = 1) =>
    fetchAPI<{ success: boolean; data: { conversation: any; messages: any[]; total: number; page: number; totalPages: number; permission: any } }>(
      `/api/messages/conversations/${conversationId}?page=${page}`
    ),

  startConversation: (tutorId: string, message: string) =>
    fetchAPI<{ success: boolean; data: { conversationId: string; isExisting: boolean } }>(
      '/api/messages/conversations',
      { method: 'POST', body: JSON.stringify({ tutorId, message }) }
    ),

  startConversationPredefined: (tutorId: string, predefinedMessageId: number) =>
    fetchAPI<{ success: boolean; data: { conversationId: string; isExisting: boolean } }>(
      '/api/messages/conversations',
      { method: 'POST', body: JSON.stringify({ tutorId, predefinedMessageId }) }
    ),

  sendMessage: (conversationId: string, message: string) =>
    fetchAPI<{ success: boolean; data: any }>(
      `/api/messages/conversations/${conversationId}`,
      { method: 'POST', body: JSON.stringify({ message }) }
    ),

  sendPredefinedMessage: (conversationId: string, predefinedMessageId: number) =>
    fetchAPI<{ success: boolean; data: any }>(
      `/api/messages/conversations/${conversationId}`,
      { method: 'POST', body: JSON.stringify({ predefinedMessageId }) }
    ),

  getUnreadCount: () =>
    fetchAPI<{ success: boolean; data: { count: number } }>('/api/messages/unread-count'),

  getPredefinedMessages: () =>
    fetchAPI<{ success: boolean; data: { id: number; text: string }[] }>('/api/messages/predefined'),

  reportMessage: (messageId: string, reason: string, details?: string) =>
    fetchAPI<{ success: boolean; message: string; data: { id: string } }>(
      `/api/messages/${messageId}/report`,
      { method: 'POST', body: JSON.stringify({ reason, details }) }
    ),
};

// ============ ADMIN ============
export const adminApi = {
  refundSubscription: (subscriptionId: string) =>
    fetchAPI<{ success: boolean; message: string; data: { refundId: string; amountRefunded: number } }>(
      `/api/admin/subscriptions/${subscriptionId}/refund`,
      { method: 'POST' }
    ),

  getResourceReports: (status = 'PENDING') =>
    fetchAPI<{ success: boolean; data: any[]; count: number }>(
      `/api/admin/resources/reports?status=${status}`
    ),

  actionResourceReport: (reportId: string, action: 'refund' | 'dismiss' | 'suspend' | 'delete') =>
    fetchAPI<{ success: boolean; message: string }>(`/api/admin/resources/reports/${reportId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),
};

// ============ GDPR ============
export const gdpr = {
  exportData: () =>
    fetchAPI<{ success: boolean; data: any }>('/api/gdpr/export'),

  deleteAccount: (confirmEmail: string, reason?: string) =>
    fetchAPI<{ success: boolean; message: string }>('/api/gdpr/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ confirmEmail, reason }),
    }),

  getConsentStatus: () =>
    fetchAPI<{ success: boolean; data: { marketingConsent: boolean; analyticsConsent: boolean; consentDate: string | null } }>(
      '/api/gdpr/consent-status'
    ),

  updateConsent: (consent: { marketingConsent: boolean; analyticsConsent: boolean }) =>
    fetchAPI<{ success: boolean; data: any }>('/api/gdpr/update-consent', {
      method: 'PUT',
      body: JSON.stringify(consent),
    }),
};
