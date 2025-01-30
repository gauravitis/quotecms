import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import QuotationForm from './components/QuotationForm';
import Companies from './components/Companies';
import Employees from './components/Employees';
import Clients from './components/Clients';
import Items from './components/Items';
import Quotations from './components/Quotations';
import { ThemeProvider, createTheme } from '@mui/material';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/items" element={<Items />} />
            <Route path="/generate-quotation" element={<QuotationForm />} />
            <Route path="/quotations" element={<Quotations />} />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 