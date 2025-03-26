import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import companyLogo from './companyLogo.png';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = () => {
        if (!email || !password) {
            setError('Email and password cannot be empty.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setLoading(true);
        setTimeout(() => {
            window.location.href = '/search';
        }, 2000);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#ffffff',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    width: 360,
                    textAlign: 'center',
                }}
            >
                <img
                    src={companyLogo}
                    alt="Platform X"
                    style={{ width: '50px', marginBottom: '20px' }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: 3,
                        fontWeight: 600,
                        color: '#333333',
                    }}
                >
                    Welcome Back
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        marginBottom: 3,
                        color: '#666666',
                    }}
                >
                    Please login to your account
                </Typography>
                <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                        },
                    }}
                />
                {error && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'red',
                            marginBottom: 2,
                        }}
                    >
                        {error}
                    </Typography>
                )}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{
                        marginTop: 3,
                        padding: 1.5,
                        backgroundColor: '#1976d2',
                        color: '#ffffff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
                <Typography
                    variant="body2"
                    sx={{
                        marginTop: 2,
                        color: '#888888',
                    }}
                >
                    Forgot your password? <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Reset it</a>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;
