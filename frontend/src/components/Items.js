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

export default function Items() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        catalogue_id: '',
        description: '',
        pack_size: '',
        cas: '',
        hsn: '',
        price: '',
        brand: '',
        gst_percentage: '',
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setItems(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch items');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchGstPercentage = async (hsnCode) => {
        try {
            const response = await fetch(`http://localhost:5000/api/hsn/${hsnCode}/gst`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    gst_percentage: data.gst_percentage
                }));
            }
        } catch (err) {
            console.error('Failed to fetch GST percentage:', err);
        }
    };

    const handleOpenDialog = (item = null) => {
        if (item) {
            setSelectedItem(item);
            setFormData({
                catalogue_id: item.catalogue_id || '',
                description: item.description || '',
                pack_size: item.pack_size || '',
                cas: item.cas || '',
                hsn: item.hsn || '',
                price: item.price || '',
                brand: item.brand || '',
                gst_percentage: item.gst_percentage || '',
            });
        } else {
            setSelectedItem(null);
            setFormData({
                catalogue_id: '',
                description: '',
                pack_size: '',
                cas: '',
                hsn: '',
                price: '',
                brand: '',
                gst_percentage: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
        setFormData({
            catalogue_id: '',
            description: '',
            pack_size: '',
            cas: '',
            hsn: '',
            price: '',
            brand: '',
            gst_percentage: '',
        });
    };

    const handleHsnChange = (e) => {
        const hsnCode = e.target.value;
        setFormData(prev => ({
            ...prev,
            hsn: hsnCode
        }));
        if (hsnCode && hsnCode.length >= 4) {
            fetchGstPercentage(hsnCode);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedItem
                ? `http://localhost:5000/api/items/${selectedItem.id}`
                : 'http://localhost:5000/api/items';
            
            const method = selectedItem ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchItems();
                handleCloseDialog();
            } else {
                throw new Error(data.error || 'Failed to save item');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    fetchItems();
                } else {
                    throw new Error(data.error || 'Failed to delete item');
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
                        Items
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Item
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
                            <TableCell>Catalogue ID</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Pack Size</TableCell>
                            <TableCell>CAS</TableCell>
                            <TableCell>HSN</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>GST %</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.catalogue_id}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.pack_size}</TableCell>
                                <TableCell>{item.cas}</TableCell>
                                <TableCell>{item.hsn}</TableCell>
                                <TableCell>{item.price ? `₹${item.price}` : ''}</TableCell>
                                <TableCell>{item.gst_percentage ? `${item.gst_percentage}%` : ''}</TableCell>
                                <TableCell>{item.brand}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(item)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(item.id)}
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
                    {selectedItem ? 'Edit Item' : 'Add New Item'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Catalogue ID"
                                    value={formData.catalogue_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, catalogue_id: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    value={formData.brand}
                                    onChange={(e) =>
                                        setFormData({ ...formData, brand: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Pack Size"
                                    value={formData.pack_size}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pack_size: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="CAS"
                                    value={formData.cas}
                                    onChange={(e) =>
                                        setFormData({ ...formData, cas: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="HSN"
                                    value={formData.hsn}
                                    onChange={handleHsnChange}
                                    helperText="Enter HSN code to auto-fetch GST percentage"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    InputProps={{
                                        startAdornment: '₹',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="GST %"
                                    type="number"
                                    value={formData.gst_percentage}
                                    onChange={(e) =>
                                        setFormData({ ...formData, gst_percentage: e.target.value })
                                    }
                                    InputProps={{
                                        endAdornment: '%',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedItem ? 'Update' : 'Add'} Item
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
} 