import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Quotations() {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/quotations');
            const data = await response.json();
            setQuotations(data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quotations:', error);
            setError('Failed to load quotations');
            setLoading(false);
        }
    };

    const handleDelete = async (quotationId) => {
        if (window.confirm('Are you sure you want to delete this quotation?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/quotations/${quotationId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                
                if (data.success) {
                    // Remove the deleted quotation from the state
                    setQuotations(quotations.filter(q => q.id !== quotationId));
                } else {
                    throw new Error(data.error || 'Failed to delete quotation');
                }
            } catch (error) {
                console.error('Error deleting quotation:', error);
                setError('Failed to delete quotation');
            }
        }
    };

    const handleDownload = async (quotationId, fileName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/download-quotation/${fileName}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading quotation:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 6 }}>
            <Container maxWidth="xl">
                {/* Header with Back Button */}
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

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reference Number</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Created Date</TableCell>
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
                                        {quotation.date ? new Date(quotation.date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Download">
                                            <IconButton
                                                onClick={() => handleDownload(quotation.id, `quotation_${quotation.ref_number.replace('/', '_')}.docx`)}
                                                color="primary"
                                                size="small"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View">
                                            <IconButton
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
            </Container>
        </Box>
    );
} 