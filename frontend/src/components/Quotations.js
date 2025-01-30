import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import { quotationsApi } from '../services/api';

// QuotationDetailsModal Component
const QuotationDetailsModal = ({ open, onClose, quotation, onDownload }) => {
    if (!quotation) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6">
                    Quotation Details - {quotation.ref_number}
                </Typography>
                <Typography variant="subtitle2">
                    {quotation.date ? format(new Date(quotation.date), 'dd/MM/yyyy') : 'N/A'}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                    {/* Company Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Company Details
                        </Typography>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Company Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {quotation.company}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        GST Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {quotation.company_gst || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Client Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Client Details
                        </Typography>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Client Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {quotation.client}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Contact Details
                                    </Typography>
                                    <Typography variant="body1">
                                        {quotation.client_contact || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Items */}
                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Items
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Unit Rate</TableCell>
                                        <TableCell align="right">GST %</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quotation.items?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">₹{item.unit_rate}</TableCell>
                                            <TableCell align="right">{item.gst_percentage}%</TableCell>
                                            <TableCell align="right">₹{item.total}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} />
                                        <TableCell align="right">
                                            <strong>Total Amount:</strong>
                                        </TableCell>
                                        <TableCell align="right">
                                            <strong>₹{quotation.total_amount}</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button 
                    variant="contained" 
                    onClick={() => onDownload(quotation.id, quotation.ref_number)}
                    color="primary"
                >
                    Download Quotation
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Quotations Component
export default function Quotations() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    // Fetch Quotations Query
    const { 
        data: quotations = [], 
        isLoading,
        error 
    } = useQuery({
        queryKey: ['quotations'],
        queryFn: quotationsApi.getAll,
    });

    // Delete Quotation Mutation
    const deleteQuotationMutation = useMutation({
        mutationFn: quotationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
        },
    });

    // View Quotation Query
    const viewQuotation = async (quotation) => {
        try {
            const data = await quotationsApi.getById(quotation.id);
            setSelectedQuotation(data);
            setViewModalOpen(true);
        } catch (err) {
            console.error('Error viewing quotation:', err);
        }
    };

    // Download Quotation
    const handleDownload = async (quotationId, refNumber) => {
        try {
            setDownloadError(null);
            const response = await fetch(`http://localhost:5000/api/quotations/${quotationId}/download`);
            
            if (!response.ok) {
                throw new Error('Failed to download quotation');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quotation_${refNumber.replace('/', '_')}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading quotation:', err);
            setDownloadError('Failed to download quotation. Please try again.');
        }
    };

    // Handle Delete
    const handleDelete = async (quotationId) => {
        if (window.confirm('Are you sure you want to delete this quotation?')) {
            await deleteQuotationMutation.mutateAsync(quotationId);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 6 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 4,
                        gap: 2
                    }}
                >
                    <IconButton
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.16)',
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                        }}
                    >
                        Quotations
                    </Typography>
                </Box>

                {/* Error Messages */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {downloadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {downloadError}
                    </Alert>
                )}

                {/* Quotations Table */}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reference Number</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotations.map((quotation) => (
                                <TableRow key={quotation.id}>
                                    <TableCell>{quotation.ref_number}</TableCell>
                                    <TableCell>{quotation.company}</TableCell>
                                    <TableCell>{quotation.client}</TableCell>
                                    <TableCell>
                                        {quotation.date ? format(new Date(quotation.date), 'dd/MM/yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">
                                        ₹{quotation.total?.toLocaleString('en-IN') || '0'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Download">
                                            <IconButton
                                                onClick={() => handleDownload(quotation.id, quotation.ref_number)}
                                                color="primary"
                                                size="small"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                onClick={() => viewQuotation(quotation)}
                                                color="info"
                                                size="small"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDelete(quotation.id)}
                                                color="error"
                                                size="small"
                                                disabled={deleteQuotationMutation.isPending}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* View Modal */}
                <QuotationDetailsModal
                    open={viewModalOpen}
                    onClose={() => {
                        setViewModalOpen(false);
                        setSelectedQuotation(null);
                    }}
                    quotation={selectedQuotation}
                    onDownload={handleDownload}
                />
            </Container>
        </Box>
    );
} 