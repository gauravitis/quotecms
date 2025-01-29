import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    IconButton,
    Divider,
    CircularProgress,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupsIcon from '@mui/icons-material/Groups';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const DashboardCard = ({ title, icon, description, onClick }) => (
    <Paper
        elevation={3}
        sx={{
            p: 4,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: 2,
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                bgcolor: 'rgba(25, 118, 210, 0.04)',
            },
        }}
        onClick={onClick}
    >
        <Box 
            sx={{ 
                textAlign: 'center', 
                mb: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}
        >
            {icon}
        </Box>
        <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ 
                fontWeight: 600,
                color: 'primary.main'
            }}
        >
            {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
                lineHeight: 1.6,
                flex: 1 
            }}
        >
            {description}
        </Typography>
    </Paper>
);

const StatCard = ({ title, value, icon, color }) => (
    <Paper
        elevation={2}
        sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            height: '100%',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
        }}
    >
        <Box
            sx={{
                bgcolor: `${color}15`,
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {value !== null ? value : <CircularProgress size={20} color="inherit" />}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
        </Box>
    </Paper>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        quotations: null,
        clients: null,
        items: null
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [quotationsRes, clientsRes, itemsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/quotations'),
                    fetch('http://localhost:5000/api/clients'),
                    fetch('http://localhost:5000/api/items')
                ]);

                const [quotationsData, clientsData, itemsData] = await Promise.all([
                    quotationsRes.json(),
                    clientsRes.json(),
                    itemsRes.json()
                ]);

                setStats({
                    quotations: quotationsData.data?.length || 0,
                    clients: clientsData.data?.length || 0,
                    items: itemsData.data?.length || 0
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('Failed to load statistics');
                setStats({
                    quotations: 0,
                    clients: 0,
                    items: 0
                });
            }
        };

        fetchStats();
    }, []);

    const dashboardItems = [
        {
            title: 'Companies',
            icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Manage your company profiles and settings',
            onClick: () => navigate('/companies')
        },
        {
            title: 'Employees',
            icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Manage employee information and roles',
            onClick: () => navigate('/employees')
        },
        {
            title: 'Clients',
            icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'View and manage your client database',
            onClick: () => navigate('/clients')
        },
        {
            title: 'Items',
            icon: <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Manage your product catalog and pricing',
            onClick: () => navigate('/items')
        },
        {
            title: 'Generate Quotation',
            icon: <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Create new quotations for clients',
            onClick: () => navigate('/generate-quotation')
        },
        {
            title: 'Quotations',
            icon: <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'View and manage all created quotations',
            onClick: () => navigate('/quotations')
        }
    ];

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                bgcolor: '#f8fafc',
                py: 6,
                px: 3 
            }}
        >
            <Container maxWidth="xl">
                {/* Header */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 6,
                        pb: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 700,
                                color: 'primary.main',
                                mb: 1
                            }}
                        >
                            ChemBio Lifesciences
                        </Typography>
                        <Typography 
                            variant="subtitle1" 
                            color="text.secondary"
                        >
                            Welcome to your dashboard
                        </Typography>
                    </Box>
                    <IconButton 
                        color="primary" 
                        onClick={() => navigate('/')}
                        title="Logout"
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.16)',
                            }
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>

                {/* Statistics Section */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Total Quotations"
                            value={stats.quotations}
                            icon={<ReceiptIcon sx={{ fontSize: 32, color: '#2196f3' }} />}
                            color="#2196f3"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Total Clients"
                            value={stats.clients}
                            icon={<GroupsIcon sx={{ fontSize: 32, color: '#4caf50' }} />}
                            color="#4caf50"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                            title="Total Items"
                            value={stats.items}
                            icon={<CategoryIcon sx={{ fontSize: 32, color: '#f57c00' }} />}
                            color="#f57c00"
                        />
                    </Grid>
                </Grid>

                {/* Dashboard Cards */}
                <Grid container spacing={3}>
                    {dashboardItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <DashboardCard {...item} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
} 