import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStore } from '../../store/rootStore';
import { Navigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const schema = yup.object().shape({
    email: yup.string().required('L\'email est requis').email('L\'email n\'est pas valide'),
    password: yup.string().required('Le mot de passe est requis'),
});

const Login = () => {
    const { rootStore: { authStore } } = useStore();
    const [errorMessage, setErrorMessage] = useState('');
    
    const { handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm({ 
        resolver: yupResolver(schema), 
        defaultValues: { email: "", password: "" } 
    });

    const isAuthenticated = authStore.isAuthenticated;

    const onSubmit = async (data: any) => {
        try {
            const resData = await authStore.login({ email: data.email, password: data.password });
            console.log('Les donnees de connexion', resData);
            reset();
            setErrorMessage('');
        } catch (error: any) {
            setErrorMessage('Vérifiez vos identifiants');
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/accueil" replace />;
    }

    return (
        <Box
            className="min-h-screen w-full flex flex-col items-center justify-center"
            sx={{padding: 2 }}
        >
            <Card className="p-4 border rounded-lg shadow" sx={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                <CardContent>
                    <Box className="text-center mb-4 bg-gradient-to-r from-green-800 to-yellow-300 p-2 rounded">
                        <Typography variant="h4" color="white">LAGANE</Typography>
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Typography variant="h6" className="text-green-800 text-center mb-4">Connexion</Typography>
                        {errorMessage && (
                            <Typography color="error" variant="body2" textAlign="center">
                                {errorMessage}
                            </Typography>
                        )}
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    variant="filled"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon className="text-green-800" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Mot de passe"
                                    type="password"
                                    variant="filled"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon className="text-green-800" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...field}
                                />
                            )}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Vérification..." : "Connecter"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default observer(Login);
