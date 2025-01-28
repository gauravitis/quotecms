import React, { useEffect, useState } from 'react';
import { getCompanies } from '../api/api';
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Box,
    CircularProgress,
    Alert,
    FormHelperText
} from '@mui/material';

export default function CompanySelector({ onCompanySelect, value = '', label = 'Select Company' }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setLoading(true);
                const response = await getCompanies();
                if (response.success) {
                    setCompanies(response.data);
                    setError(null);
                } else {
                    setError('Failed to load companies');
                }
            } catch (err) {
                setError(err.message || 'Failed to load companies');
            } finally {
                setLoading(false);
            }
        };

        loadCompanies();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="company-select-label">{label}</InputLabel>
            <Select
                labelId="company-select-label"
                value={value}
                label={label}
                onChange={(e) => onCompanySelect(e.target.value)}
                displayEmpty
            >
                <MenuItem value="" disabled>
                    <em>Select a company</em>
                </MenuItem>
                {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                        {company.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
} 