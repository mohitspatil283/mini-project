const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('mediguide_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('mediguide_token', token);
}

export function removeStoredToken() {
  localStorage.removeItem('mediguide_token');
  localStorage.removeItem('mediguide_user');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'A network or server error occurred.');
  }

  return data;
}

export const api = {
  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),
  updateProfile: (body: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Facilities Search & Details
  searchFacilities: (params: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return request<any>(`/facilities/search?${query.toString()}`);
  },
  getLocations: () => request<any>('/facilities/locations'),
  getPublicStats: () => request<any>('/facilities/summary-stats'),
  getFacilityDetails: (id: number, lat?: number, lng?: number) => {
    const query = new URLSearchParams();
    if (lat !== undefined && lng !== undefined) {
      query.append('lat', String(lat));
      query.append('lng', String(lng));
    }
    return request<any>(`/facilities/${id}?${query.toString()}`);
  },

  // Services
  getServices: () => request<any>('/services'),
  createService: (body: any) => request<any>('/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id: number, body: any) => request<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id: number) => request<any>(`/services/${id}`, { method: 'DELETE' }),

  // Costs
  compareCosts: (facilityIds: number[], serviceId?: number) => {
    const query = new URLSearchParams({
      facility_ids: facilityIds.join(','),
    });
    if (serviceId) query.append('service_id', String(serviceId));
    return request<any>(`/costs/compare?${query.toString()}`);
  },
  submitCost: (body: any) => request<any>('/costs/submit', { method: 'POST', body: JSON.stringify(body) }),

  // Saved Facilities
  getSavedFacilities: () => request<any>('/saved-facilities'),
  saveFacility: (facilityId: number) => request<any>(`/saved-facilities/${facilityId}`, { method: 'POST' }),
  removeSavedFacility: (facilityId: number) => request<any>(`/saved-facilities/${facilityId}`, { method: 'DELETE' }),

  // Reports
  submitReport: (body: any) => request<any>('/reports', { method: 'POST', body: JSON.stringify(body) }),
  getMyReports: () => request<any>('/reports/my-reports'),

  // Facility Representative
  getRepDashboard: () => request<any>('/rep/dashboard'),
  proposeRepUpdate: (body: any) => request<any>('/rep/propose-update', { method: 'POST', body: JSON.stringify(body) }),
  addRepService: (service_id: number) => request<any>('/rep/services', { method: 'POST', body: JSON.stringify({ service_id }) }),
  removeRepService: (service_id: number) => request<any>(`/rep/services/${service_id}`, { method: 'DELETE' }),
  getRepRevisions: () => request<any>('/rep/revisions'),

  // Admin
  getAdminStats: () => request<any>('/admin/statistics'),
  getAdminUsers: (params?: { role?: string; search?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any>(`/admin/users?${q}`);
  },
  updateUserStatus: (userId: number, status: string) =>
    request<any>(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  assignRepresentative: (userId: number, facility_id: number | null) =>
    request<any>(`/admin/users/${userId}/assign-facility`, { method: 'PUT', body: JSON.stringify({ facility_id }) }),

  getAdminFacilities: (params?: { status?: string; type?: string; search?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any>(`/admin/facilities?${q}`);
  },
  createFacility: (body: any) => request<any>('/admin/facilities', { method: 'POST', body: JSON.stringify(body) }),
  updateFacility: (id: number, body: any) => request<any>(`/admin/facilities/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  verifyFacility: (id: number, action: 'APPROVE' | 'REJECT') =>
    request<any>(`/admin/facilities/${id}/verify`, { method: 'PUT', body: JSON.stringify({ action }) }),
  deleteFacility: (id: number, archiveOnly = false) =>
    request<any>(`/admin/facilities/${id}?archive_only=${archiveOnly}`, { method: 'DELETE' }),

  getVerificationQueue: () => request<any>('/admin/verification-queue'),
  reviewRevision: (id: number, action: 'APPROVE' | 'REJECT' | 'CORRECTION_REQUESTED', review_notes?: string) =>
    request<any>(`/admin/revisions/${id}/review`, { method: 'PUT', body: JSON.stringify({ action, review_notes }) }),

  getAdminCosts: (params?: { status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any>(`/admin/costs?${q}`);
  },
  verifyCostRecord: (id: number, action: 'APPROVE' | 'REJECT') =>
    request<any>(`/admin/costs/${id}/verify`, { method: 'PUT', body: JSON.stringify({ action }) }),

  getAdminReports: (params?: { status?: string; category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any>(`/admin/reports?${q}`);
  },
  updateReportStatus: (id: number, status: string, admin_notes?: string) =>
    request<any>(`/admin/reports/${id}`, { method: 'PUT', body: JSON.stringify({ status, admin_notes }) }),

  getAdminAuditLogs: (params?: { limit?: number; offset?: number; action?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any>(`/admin/audit-logs?${q}`);
  },
};
