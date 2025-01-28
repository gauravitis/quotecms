import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { createQuotation, generateQuote } from '../api/api';
import CompanySelector from './CompanySelector';

const initialItemState = { name: '', qty: 1, price: 0 };

// Validation rules
const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.company_id) {
        errors.company_id = 'Please select a company';
    }
    
    if (!formData.items || formData.items.length === 0) {
        errors.items = 'At least one item is required';
    } else {
        const itemErrors = formData.items.map(item => {
            const itemError = {};
            if (!item.name || item.name.trim() === '') {
                itemError.name = 'Item name is required';
            }
            if (!item.qty || item.qty < 1) {
                itemError.qty = 'Quantity must be at least 1';
            }
            if (!item.price || item.price < 0) {
                itemError.price = 'Price must be non-negative';
            }
            return Object.keys(itemError).length > 0 ? itemError : null;
        });
        
        if (itemErrors.some(error => error !== null)) {
            errors.items = itemErrors;
        }
    }
    
    return errors;
};

export default function QuotationForm() {
    const [formData, setFormData] = useState({
        company_id: '',
        items: [{ ...initialItemState }]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleCompanySelect = (companyId) => {
        setFormData(prev => ({ ...prev, company_id: companyId }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { ...initialItemState }]
        }));
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const calculateTotal = () => {
        return formData.items.reduce((total, item) => {
            return total + (Number(item.price) * Number(item.qty));
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        setValidationErrors({});

        console.log('Submitting form data:', formData); // Debug log

        // Validate form
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors); // Debug log
            setValidationErrors(errors);
            setLoading(false);
            return;
        }

        try {
            console.log('Creating quotation...'); // Debug log
            const quotationResponse = await createQuotation({
                ...formData,
                total: calculateTotal()
            });
            
            console.log('Quotation response:', quotationResponse); // Debug log

            if (!quotationResponse.success) {
                throw new Error(quotationResponse.error || 'Failed to create quotation');
            }

            setSuccess('Quotation created successfully!');
            const quotationId = quotationResponse.data.id;
            
            console.log('Generating quote document...'); // Debug log
            const blob = await generateQuote(quotationId);
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quotation-${quotationId}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Reset form
            setFormData({
                company_id: '',
                items: [{ ...initialItemState }]
            });
        } catch (err) {
            console.error('Error creating quotation:', err); // Debug log
            setError(err.message || 'An error occurred while creating the quotation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create New Quotation
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <CompanySelector
                                value={formData.company_id}
                                onCompanySelect={handleCompanySelect}
                                error={!!validationErrors.company_id}
                                helperText={validationErrors.company_id}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Items
                            </Typography>
                            {validationErrors.items && typeof validationErrors.items === 'string' && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {validationErrors.items}
                                </Alert>
                            )}
                            {formData.items.map((item, index) => (
                                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2 }}>
                                    <TextField
                                        label="Item Name"
                                        value={item.name}
                                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                        required
                                        sx={{ flex: 2 }}
                                        error={!!validationErrors.items?.[index]?.name}
                                        helperText={validationErrors.items?.[index]?.name}
                                    />
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                        required
                                        sx={{ flex: 1 }}
                                        error={!!validationErrors.items?.[index]?.qty}
                                        helperText={validationErrors.items?.[index]?.qty}
                                    />
                                    <TextField
                                        label="Price"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                        required
                                        sx={{ flex: 1 }}
                                        error={!!validationErrors.items?.[index]?.price}
                                        helperText={validationErrors.items?.[index]?.price}
                                    />
                                    <IconButton 
                                        color="error" 
                                        onClick={() => removeItem(index)}
                                        disabled={formData.items.length === 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addItem}
                                variant="outlined"
                                sx={{ mt: 1 }}
                            >
                                Add Item
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Total: ${calculateTotal().toFixed(2)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                                fullWidth
                            >
                                {loading ? 'Creating Quotation...' : 'Create and Download Quotation'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
} 