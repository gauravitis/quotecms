import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Upload as UploadIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '../services/api';

const BACKEND_URL = 'http://localhost:5000';

export default function Companies() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        gst_number: '',
        pan_number: '',
        seal_image_url: '',
        ref_format: 'QT-{YYYY}-{NUM}',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        account_type: 'Current Account',
        phone: '',
    });

    // Queries
    const { data: companies = [], isLoading: loading, error } = useQuery({
        queryKey: ['companies'],
        queryFn: companiesApi.getAll,
    });

    // Mutations
    const createCompany = useMutation({
        mutationFn: companiesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });

    const updateCompanyMutation = useMutation({
        mutationFn: ({ id, data }) => companiesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });

    const deleteCompanyMutation = useMutation({
        mutationFn: companiesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
    });

    const handleOpenDialog = (company = null) => {
        if (company) {
            setSelectedCompany(company);
            setFormData({
                name: company.name,
                email: company.email || '',
                address: company.address || '',
                gst_number: company.gst_number || '',
                pan_number: company.pan_number || '',
                seal_image_url: company.seal_image_url || '',
                ref_format: company.ref_format || 'QT-{YYYY}-{NUM}',
                bank_name: company.bank_name || '',
                account_number: company.account_number || '',
                ifsc_code: company.ifsc_code || '',
                account_type: company.account_type || 'Current Account',
                phone: company.phone || '',
            });
        } else {
            setSelectedCompany(null);
            setFormData({
                name: '',
                email: '',
                address: '',
                gst_number: '',
                pan_number: '',
                seal_image_url: '',
                ref_format: 'QT-{YYYY}-{NUM}',
                bank_name: '',
                account_number: '',
                ifsc_code: '',
                account_type: 'Current Account',
                phone: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCompany(null);
        setFormData({
            name: '',
            email: '',
            address: '',
            gst_number: '',
            pan_number: '',
            seal_image_url: '',
            ref_format: 'QT-{YYYY}-{NUM}',
            bank_name: '',
            account_number: '',
            ifsc_code: '',
            account_type: 'Current Account',
            phone: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedCompany) {
            await updateCompanyMutation.mutateAsync({ 
                id: selectedCompany.id, 
                data: formData 
            });
        } else {
            await createCompany.mutateAsync(formData);
        }
        handleCloseDialog();
    };

    const handleDelete = async (companyId) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            await deleteCompanyMutation.mutateAsync(companyId);
        }
    };

    const handleSealImageUpload = async (companyId, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('seal_image', file);

        try {
            const response = await fetch(`http://localhost:5000/api/companies/${companyId}/seal`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['companies'] });
            } else {
                throw new Error(data.error || 'Failed to upload seal image');
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const getFullImageUrl = (relativePath) => {
        if (!relativePath) return null;
        return `${BACKEND_URL}${relativePath}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        Companies
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Company
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>GST Number</TableCell>
                            <TableCell>PAN Number</TableCell>
                            <TableCell>Bank Details</TableCell>
                            <TableCell>Company Seal</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>{company.gst_number}</TableCell>
                                <TableCell>{company.pan_number}</TableCell>
                                <TableCell>
                                    {company.bank_name && (
                                        <>
                                            <Typography variant="body2" component="div">
                                                <strong>Bank:</strong> {company.bank_name}
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                <strong>A/C:</strong> {company.account_number}
                                            </Typography>
                                            <Typography variant="body2" component="div">
                                                <strong>IFSC:</strong> {company.ifsc_code}
                                            </Typography>
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {company.seal_image_url ? (
                                        <img
                                            src={getFullImageUrl(company.seal_image_url)}
                                            alt="Company Seal"
                                            style={{ 
                                                width: 100, 
                                                height: 100, 
                                                objectFit: 'contain',
                                                border: '1px solid #eee',
                                                borderRadius: '4px',
                                                padding: '4px'
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            component="label"
                                            startIcon={<UploadIcon />}
                                            size="small"
                                            variant="outlined"
                                        >
                                            Upload Seal
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => handleSealImageUpload(company.id, e)}
                                            />
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(company)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(company.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedCompany ? 'Edit Company' : 'Add New Company'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    multiline
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="GST Number"
                                    name="gst_number"
                                    value={formData.gst_number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, gst_number: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="PAN Number"
                                    name="pan_number"
                                    value={formData.pan_number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pan_number: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Reference Format"
                                    name="ref_format"
                                    value={formData.ref_format}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ref_format: e.target.value })
                                    }
                                    helperText="Use {YYYY} for year and {NUM} for number"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Bank Details
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    value={formData.bank_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, bank_name: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    value={formData.account_number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, account_number: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="IFSC Code"
                                    value={formData.ifsc_code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ifsc_code: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Account Type"
                                    value={formData.account_type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, account_type: e.target.value })
                                    }
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedCompany ? 'Update' : 'Add'} Company
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
} 