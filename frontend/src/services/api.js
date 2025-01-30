const API_URL = 'http://localhost:5000/api';

// Generic API request function with error handling
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }
  return data.data;
}

// Companies API
export const companiesApi = {
  getAll: () => apiRequest('/companies'),
  getById: (id) => apiRequest(`/companies/${id}`),
  create: (data) => apiRequest('/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/companies/${id}`, {
    method: 'DELETE',
  }),
  uploadSeal: (id, formData) => apiRequest(`/companies/${id}/seal`, {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set content-type for FormData
  }),
};

// Quotations API
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
    }
    return data.data;
};

export const quotationsApi = {
    // Get all quotations
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/quotations`);
        return handleResponse(response);
    },

    // Get quotation by ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}`);
        return handleResponse(response);
    },

    // Create new quotation
    create: async (quotationData) => {
        const response = await fetch(`${API_BASE_URL}/quotations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quotationData),
        });
        return handleResponse(response);
    },

    // Update quotation
    update: async (id, quotationData) => {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quotationData),
        });
        return handleResponse(response);
    },

    // Delete quotation
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    download: (fileName) => fetch(`${API_BASE_URL}/download-quotation/${fileName}`),
};

// Clients API
export const clientsApi = {
  getAll: () => apiRequest('/clients'),
  getById: (id) => apiRequest(`/clients/${id}`),
  create: (data) => apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/clients/${id}`, {
    method: 'DELETE',
  }),
};

// Employees API
export const employeesApi = {
  getAll: () => apiRequest('/employees'),
  getById: (id) => apiRequest(`/employees/${id}`),
  create: (data) => apiRequest('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  }),
}; 