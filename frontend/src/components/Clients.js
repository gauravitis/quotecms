import React, { useState, useEffect } from 'react';
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
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Clients() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        business_name: '',
        address: '',
        email: '',
        mobile: '',
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/clients');
            const data = await response.json();
            if (data.success) {
                setClients(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch clients');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (client = null) => {
        if (client) {
            setSelectedClient(client);
            setFormData({
                name: client.name,
                business_name: client.business_name || '',
                address: client.address || '',
                email: client.email || '',
                mobile: client.mobile || '',
            });
        } else {
            setSelectedClient(null);
            setFormData({
                name: '',
                business_name: '',
                address: '',
                email: '',
                mobile: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedClient(null);
        setFormData({
            name: '',
            business_name: '',
            address: '',
            email: '',
            mobile: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedClient
                ? `http://localhost:5000/api/clients/${selectedClient.id}`
                : 'http://localhost:5000/api/clients';
            
            const method = selectedClient ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchClients();
                handleCloseDialog();
            } else {
                throw new Error(data.error || 'Failed to save client');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    fetchClients();
                } else {
                    throw new Error(data.error || 'Failed to delete client');
                }
            } catch (err) {
                setError(err.message);
            }
        }
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
                        Clients
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Client
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
                            <TableCell>Contact Name</TableCell>
                            <TableCell>Business Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.business_name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.mobile}</TableCell>
                                <TableCell>{client.address}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(client)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(client.id)}
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
                    {selectedClient ? 'Edit Client' : 'Add New Client'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Name"
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
                                    label="Business Name"
                                    value={formData.business_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, business_name: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile"
                                    value={formData.mobile}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mobile: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    multiline
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedClient ? 'Update' : 'Add'} Client
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
} 