import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_BASE_URL,
});

// Company endpoints
export const getCompanies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

export const createCompany = (companyData) => API.post('/companies', companyData);

// Client endpoints
export const getClients = async (companyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/clients?company_id=${companyId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};

export const createClient = (clientData) => API.post('/clients', clientData);

// Quotation endpoints
export const fetchQuotations = (filters) => {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('company_id', filters.companyId);
    if (filters?.clientId) params.append('client_id', filters.clientId);
    return API.get(`/quotations?${params.toString()}`);
};

export const createQuotation = async (quotationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/quotations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quotationData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating quotation:', error);
        throw error;
    }
};

// Document generation
export const generateQuote = async (quotationId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-quote/${quotationId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error generating quote:', error);
        throw error;
    }
};

// Add response interceptor for error handling
API.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    }
); 