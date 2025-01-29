import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    IconButton,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardCard = ({ title, icon, description, onClick }) => (
    <Paper
        elevation={3}
        sx={{
            p: 3,
            height: '100%',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'scale(1.02)',
            },
        }}
        onClick={onClick}
    >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
            {icon}
        </Box>
        <Typography variant="h5" component="h2" gutterBottom align="center">
            {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
            {description}
        </Typography>
    </Paper>
);

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        ChemBio Lifesciences Dashboard
                    </Typography>
                    <IconButton 
                        color="primary" 
                        onClick={() => navigate('/')}
                        title="Logout"
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>

                {/* Dashboard Cards */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={3}>
                        <DashboardCard
                            title="Companies"
                            icon={<BusinessIcon sx={{ fontSize: 48, color: '#1976d2' }} />}
                            description="Manage company profiles and information"
                            onClick={() => navigate('/companies')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DashboardCard
                            title="Employees"
                            icon={<PeopleIcon sx={{ fontSize: 48, color: '#2e7d32' }} />}
                            description="Manage employee directory and details"
                            onClick={() => navigate('/employees')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DashboardCard
                            title="Clients"
                            icon={<GroupIcon sx={{ fontSize: 48, color: '#ed6c02' }} />}
                            description="Manage client information and details"
                            onClick={() => navigate('/clients')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DashboardCard
                            title="Items"
                            icon={<InventoryIcon sx={{ fontSize: 48, color: '#9c27b0' }} />}
                            description="Manage product catalogue and inventory"
                            onClick={() => navigate('/items')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <DashboardCard
                            title="Quotations"
                            icon={<DescriptionIcon sx={{ fontSize: 48, color: '#d32f2f' }} />}
                            description="Create and manage quotations"
                            onClick={() => navigate('/quotations')}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 