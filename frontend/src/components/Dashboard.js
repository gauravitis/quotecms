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

const cardColors = {
    Companies: '#2196f3', // Blue
    Employees: '#4caf50', // Green
    Clients: '#f57c00',   // Orange
    Items: '#9c27b0',     // Purple
    'Generate Quotation': '#e91e63', // Pink
    Quotations: '#00bcd4'  // Cyan
};

const DashboardCard = ({ title, icon, description, onClick }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: 2,
            bgcolor: '#ffffff',
            border: '2px solid',
            borderColor: `${cardColors[title]}20`,
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: cardColors[title],
                transition: 'all 0.3s ease',
            },
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 16px ${cardColors[title]}20`,
                borderColor: cardColors[title],
                '&:before': {
                    width: '6px',
                },
            },
        }}
        onClick={onClick}
    >
        <Box 
            sx={{ 
                textAlign: 'center', 
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                }
            }}
        >
            {React.cloneElement(icon, { 
                sx: { 
                    fontSize: 40, 
                    color: cardColors[title],
                    transition: 'all 0.3s ease',
                } 
            })}
        </Box>
        <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ 
                fontWeight: 600,
                color: cardColors[title],
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
            }}
        >
            {title}
        </Typography>
        <Divider 
            sx={{ 
                my: 1.5, 
                width: '50%', 
                mx: 'auto',
                bgcolor: `${cardColors[title]}30`,
            }} 
        />
        <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
                lineHeight: 1.5,
                flex: 1,
                fontSize: '0.875rem'
            }}
        >
            {description}
        </Typography>
    </Paper>
);

const StatCard = ({ title, value, icon, color }) => (
    <Paper
        elevation={0}
        sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            height: '100%',
            borderRadius: 2,
            bgcolor: '#ffffff',
            border: '2px solid',
            borderColor: `${color}20`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: color,
                transition: 'all 0.3s ease',
            },
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 16px ${color}20`,
                borderColor: color,
                '&:before': {
                    width: '6px',
                },
            },
        }}
    >
        <Box
            sx={{
                bgcolor: `${color}08`,
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: `${color}20`,
                transition: 'all 0.3s ease',
            }}
        >
            {React.cloneElement(icon, { 
                sx: { 
                    fontSize: 32, 
                    color: color,
                    transition: 'all 0.3s ease',
                } 
            })}
        </Box>
        <Box>
            <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                    fontWeight: 600, 
                    mb: 0.5, 
                    color: color,
                    transition: 'all 0.3s ease',
                }}
            >
                {value !== null ? value : <CircularProgress size={20} color="inherit" />}
            </Typography>
            <Typography 
                variant="body2" 
                sx={{ 
                    fontWeight: 500,
                    color: `${color}99`,
                    transition: 'all 0.3s ease',
                }}
            >
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
                py: 4,
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
                        mb: 4,
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
                                mb: 0.5
                            }}
                        >
                            ChemBio Lifesciences
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Welcome to your dashboard
                        </Typography>
                    </Box>
                    <IconButton 
                        color="primary" 
                        onClick={() => navigate('/')}
                        title="Logout"
                        sx={{
                            p: 2,
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.16)',
                            }
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                </Box>

                {/* Stats Section */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Total Quotations"
                            value={stats.quotations}
                            icon={<ReceiptIcon />}
                            color={cardColors.Quotations}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Active Clients"
                            value={stats.clients}
                            icon={<GroupsIcon />}
                            color={cardColors.Clients}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            title="Product Items"
                            value={stats.items}
                            icon={<CategoryIcon />}
                            color={cardColors.Items}
                        />
                    </Grid>
                </Grid>

                {/* Main Actions Grid */}
                <Grid 
                    container 
                    spacing={3} 
                    sx={{ 
                        '& > .MuiGrid-item': {
                            mt: 3, // Add top margin to each grid item
                        }
                    }}
                >
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