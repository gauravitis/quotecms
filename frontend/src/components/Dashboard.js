import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    IconButton,
    Divider,
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

export default function Dashboard() {
    const navigate = useNavigate();

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

                {/* Dashboard Cards */}
                <Grid 
                    container 
                    spacing={4} 
                    sx={{ 
                        mt: 2,
                        mb: 4,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start'
                    }}
                >
                    {/* Top Row */}
                    <Grid item xs={12} sm={6} lg={4}>
                        <DashboardCard
                            title="Companies"
                            icon={<BusinessIcon sx={{ fontSize: 56, color: '#1976d2' }} />}
                            description="Manage and view all company profiles, details, and related information"
                            onClick={() => navigate('/companies')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <DashboardCard
                            title="Employees"
                            icon={<PeopleIcon sx={{ fontSize: 56, color: '#2e7d32' }} />}
                            description="Access and manage employee records, roles, and contact details"
                            onClick={() => navigate('/employees')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <DashboardCard
                            title="Clients"
                            icon={<GroupIcon sx={{ fontSize: 56, color: '#ed6c02' }} />}
                            description="View and manage client database, contacts, and interactions"
                            onClick={() => navigate('/clients')}
                        />
                    </Grid>

                    {/* Bottom Row */}
                    <Grid 
                        container 
                        item 
                        xs={12} 
                        spacing={4}
                        sx={{
                            mt: { xs: 4, sm: 8 },  // Added more margin top
                            justifyContent: 'center'
                        }}
                    >
                        <Grid item xs={12} sm={6} lg={4}>
                            <DashboardCard
                                title="Items"
                                icon={<InventoryIcon sx={{ fontSize: 56, color: '#9c27b0' }} />}
                                description="Browse and manage your product catalogue and inventory items"
                                onClick={() => navigate('/items')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <DashboardCard
                                title="Quotations"
                                icon={<DescriptionIcon sx={{ fontSize: 56, color: '#d32f2f' }} />}
                                description="Generate, track, and manage all your business quotations"
                                onClick={() => navigate('/quotations')}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 