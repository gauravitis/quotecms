import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function QuotationForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Form Data States
    const [companies, setCompanies] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [clients, setClients] = useState([]);
    const [items, setItems] = useState([]);
    
    // Selected Values
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [refNumber, setRefNumber] = useState('');
    const [quotationDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    
    // Items in quotation
    const [quotationItems, setQuotationItems] = useState([]);
    
    // Payment Terms
    const [paymentTerms, setPaymentTerms] = useState('100% Payment against delivery of products');
    
    const paymentTermsOptions = [
        '100% Payment against delivery of products',
        '100% Payment within 15 days of delivery',
        '100% Payment within 30 days of delivery',
        '50% Advance Payment and 50% on delivery of products'
    ];

    // Fixed terms
    const fixedTerms = [
        'Please check product details before confirming your order',
        'Lead Time: Please check individual items in quotation for their lead time',
        'Order once placed will not be cancelled',
        'Validity of quotation: 30 Days'
    ];

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            // Fetch companies
            const companiesRes = await fetch('http://localhost:5000/api/companies', {
                credentials: 'include'
            });
            const companiesData = await companiesRes.json();
            if (companiesData.success) {
                setCompanies(companiesData.data);
            }

            // Fetch employees
            const employeesRes = await fetch('http://localhost:5000/api/employees', {
                credentials: 'include'
            });
            const employeesData = await employeesRes.json();
            if (employeesData.success) {
                setEmployees(employeesData.data);
            }

            // Fetch clients
            const clientsRes = await fetch('http://localhost:5000/api/clients', {
                credentials: 'include'
            });
            const clientsData = await clientsRes.json();
            if (clientsData.success) {
                setClients(clientsData.data);
            }

            // Fetch items
            const itemsRes = await fetch('http://localhost:5000/api/items', {
                credentials: 'include'
            });
            const itemsData = await itemsRes.json();
            if (itemsData.success) {
                setItems(itemsData.data);
            }

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Handle company selection and generate reference number
    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        if (company) {
            const year = new Date().getFullYear();
            const nextNumber = (company.last_quote_number || 0) + 1;
            const ref = company.ref_format
                .replace('{YYYY}', year)
                .replace('{NUM}', String(nextNumber).padStart(3, '0'));
            setRefNumber(ref);
        } else {
            setRefNumber('');
        }
    };

    // Add new item to quotation
    const addQuotationItem = () => {
        setQuotationItems([
            ...quotationItems,
            {
                id: Date.now(),
                catalogue_id: '',
                description: '',
                pack_size: '',
                quantity: 1,
                hsn: '',
                unit_rate: 0,
                discount_percentage: 0,
                discount_rate: 0,
                expanded_rate: 0,
                gst_percentage: 0,
                gst_value: 0,
                total: 0,
                lead_time: '',
                brand: ''
            }
        ]);
    };

    // Remove item from quotation
    const removeQuotationItem = (index) => {
        const newItems = [...quotationItems];
        newItems.splice(index, 1);
        setQuotationItems(newItems);
    };

    // Calculate totals
    const calculateTotals = () => {
        const subTotal = quotationItems.reduce((sum, item) => sum + item.expanded_rate, 0);
        const totalGST = quotationItems.reduce((sum, item) => sum + item.gst_value, 0);
        const grandTotal = subTotal + totalGST;
        return { subTotal, totalGST, grandTotal };
    };

    // Update item calculations
    const updateItemCalculations = (index, field, value) => {
        const newItems = [...quotationItems];
        const item = newItems[index];

        // Update the changed field
        item[field] = value;

        // Recalculate values
        if (field === 'unit_rate' || field === 'discount_percentage' || field === 'quantity') {
            item.discount_rate = item.unit_rate * (1 - item.discount_percentage / 100);
            item.expanded_rate = item.quantity * item.discount_rate;
            item.gst_value = item.expanded_rate * (item.gst_percentage / 100);
            item.total = item.expanded_rate + item.gst_value;
        }

        setQuotationItems(newItems);
    };

    // Handle item selection
    const handleItemSelect = (index, selectedItem) => {
        if (selectedItem) {
            const newItems = [...quotationItems];
            newItems[index] = {
                ...newItems[index],
                catalogue_id: selectedItem.catalogue_id,
                description: selectedItem.description,
                pack_size: selectedItem.pack_size,
                hsn: selectedItem.hsn,
                unit_rate: selectedItem.price || 0,
                gst_percentage: selectedItem.gst_percentage || 0,
                brand: selectedItem.brand
            };
            setQuotationItems(newItems);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const { subTotal, totalGST, grandTotal } = calculateTotals();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        Create Quotation
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                {/* Company and Employee Selection */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={companies}
                            getOptionLabel={(option) => option.name}
                            value={selectedCompany}
                            onChange={(_, newValue) => handleCompanySelect(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Company" required />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => option.name}
                            value={selectedEmployee}
                            onChange={(_, newValue) => setSelectedEmployee(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Employee" required />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Reference Number and Date */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Reference Number"
                            value={refNumber}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Date"
                            type="date"
                            value={quotationDate}
                            disabled
                        />
                    </Grid>
                </Grid>

                {/* Client Selection */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={clients}
                            getOptionLabel={(option) => `${option.name} - ${option.business_name}`}
                            value={selectedClient}
                            onChange={(_, newValue) => setSelectedClient(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Client" required />
                            )}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Items Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Items</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addQuotationItem}
                    >
                        Add Item
                    </Button>
                </Box>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Catalogue ID</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Pack Size</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>HSN</TableCell>
                                <TableCell>Unit Rate</TableCell>
                                <TableCell>Discount %</TableCell>
                                <TableCell>Discount Rate</TableCell>
                                <TableCell>Expanded Rate</TableCell>
                                <TableCell>GST %</TableCell>
                                <TableCell>GST Value</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Lead Time</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotationItems.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Autocomplete
                                            options={items}
                                            getOptionLabel={(option) => option.catalogue_id || ''}
                                            onChange={(_, newValue) => handleItemSelect(index, newValue)}
                                            renderInput={(params) => (
                                                <TextField {...params} size="small" />
                                            )}
                                            sx={{ width: 150 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.description}
                                            onChange={(e) => updateItemCalculations(index, 'description', e.target.value)}
                                            size="small"
                                            multiline
                                            maxRows={3}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.pack_size}
                                            onChange={(e) => updateItemCalculations(index, 'pack_size', e.target.value)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItemCalculations(index, 'quantity', Number(e.target.value))}
                                            size="small"
                                            sx={{ width: 80 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.hsn}
                                            onChange={(e) => updateItemCalculations(index, 'hsn', e.target.value)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.unit_rate}
                                            onChange={(e) => updateItemCalculations(index, 'unit_rate', Number(e.target.value))}
                                            size="small"
                                            sx={{ width: 100 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.discount_percentage}
                                            onChange={(e) => updateItemCalculations(index, 'discount_percentage', Number(e.target.value))}
                                            size="small"
                                            sx={{ width: 80 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.discount_rate.toFixed(2)}
                                            size="small"
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.expanded_rate.toFixed(2)}
                                            size="small"
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.gst_percentage}
                                            size="small"
                                            disabled
                                            sx={{ width: 80 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.gst_value.toFixed(2)}
                                            size="small"
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.total.toFixed(2)}
                                            size="small"
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.lead_time}
                                            onChange={(e) => updateItemCalculations(index, 'lead_time', e.target.value)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={item.brand}
                                            size="small"
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeQuotationItem(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Totals */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography><strong>Sub Total:</strong> ₹{subTotal.toFixed(2)}</Typography>
                    <Typography><strong>Total GST:</strong> ₹{totalGST.toFixed(2)}</Typography>
                    <Typography variant="h6"><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</Typography>
                </Box>
            </Paper>

            {/* Terms and Conditions */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Terms and Conditions</Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Payment Terms</InputLabel>
                    <Select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        label="Payment Terms"
                    >
                        {paymentTermsOptions.map((term) => (
                            <MenuItem key={term} value={term}>
                                {term}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="subtitle1" gutterBottom>Fixed Terms:</Typography>
                {fixedTerms.map((term, index) => (
                    <Typography key={index} variant="body2" gutterBottom>
                        {index + 1}. {term}
                    </Typography>
                ))}
            </Paper>

            {/* Submit Button */}
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                        // Handle quotation submission
                    }}
                >
                    Generate Quotation
                </Button>
            </Box>
        </Container>
    );
} 