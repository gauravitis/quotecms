import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    Alert,
    Paper,
    Fade,
    Grow,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BiotechIcon from '@mui/icons-material/Biotech';
import { keyframes } from '@mui/system';

// Define animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export default function LandingPage() {
    const navigate = useNavigate();
    const [showContent, setShowContent] = React.useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 50%, #bbdefb 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    animation: `${pulse} 10s infinite ease-in-out`
                }
            }}
        >
            <Fade in={showContent} timeout={1000}>
                <Container maxWidth="md">
                    <Paper
                        elevation={6}
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #1976d2, #64b5f6, #1976d2)',
                                backgroundSize: '200% 100%',
                                animation: 'gradient 3s linear infinite',
                                '@keyframes gradient': {
                                    '0%': { backgroundPosition: '200% 0' },
                                    '100%': { backgroundPosition: '-200% 0' }
                                }
                            }
                        }}
                    >
                        <Grow in={showContent} timeout={1500}>
                            <Box sx={{ mb: 4 }}>
                                <BiotechIcon 
                                    sx={{ 
                                        fontSize: 80, 
                                        color: '#1976d2',
                                        animation: `${float} 3s ease-in-out infinite`,
                                        mb: 2
                                    }} 
                                />
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        color: '#1976d2',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                                        letterSpacing: '-0.5px'
                                    }}
                                >
                                    ChemBio Lifesciences
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mb: 4, fontWeight: 400 }}
                                >
                                    Internal Management System
                                </Typography>
                            </Box>
                        </Grow>

                        <Grow in={showContent} timeout={2000}>
                            <Alert
                                severity="warning"
                                icon={<SecurityIcon />}
                                sx={{
                                    mb: 4,
                                    '& .MuiAlert-message': {
                                        fontSize: '1.1rem'
                                    },
                                    '& .MuiAlert-icon': {
                                        fontSize: '2rem'
                                    },
                                    background: 'rgba(255, 244, 229, 0.9)',
                                    border: '1px solid #ed6c02'
                                }}
                            >
                                This is a restricted internal system for ChemBio Lifesciences employees only.
                                Unauthorized access is strictly prohibited.
                            </Alert>
                        </Grow>

                        <Grow in={showContent} timeout={2500}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/dashboard')}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                    textTransform: 'none',
                                    background: 'linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 10px 4px rgba(33, 150, 243, .3)',
                                    }
                                }}
                            >
                                Enter Dashboard
                            </Button>
                        </Grow>
                    </Paper>
                </Container>
            </Fade>
        </Box>
    );
} 