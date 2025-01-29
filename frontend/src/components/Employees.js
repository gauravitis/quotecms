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

export default function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        email: '',
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/employees');
            const data = await response.json();
            if (data.success) {
                setEmployees(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch employees');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (employee = null) => {
        if (employee) {
            setSelectedEmployee(employee);
            setFormData({
                name: employee.name,
                phone_number: employee.phone_number || '',
                email: employee.email || '',
            });
        } else {
            setSelectedEmployee(null);
            setFormData({
                name: '',
                phone_number: '',
                email: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
        setFormData({
            name: '',
            phone_number: '',
            email: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedEmployee
                ? `http://localhost:5000/api/employees/${selectedEmployee.id}`
                : 'http://localhost:5000/api/employees';
            
            const method = selectedEmployee ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchEmployees();
                handleCloseDialog();
            } else {
                throw new Error(data.error || 'Failed to save employee');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    fetchEmployees();
                } else {
                    throw new Error(data.error || 'Failed to delete employee');
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
                        Employees
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Employee
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
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.phone_number}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(employee)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(employee.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Employee Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone_number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone_number: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedEmployee ? 'Update' : 'Add'} Employee
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
} 