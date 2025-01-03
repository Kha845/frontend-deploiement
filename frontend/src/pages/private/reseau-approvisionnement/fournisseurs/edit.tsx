/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    nom: Yup.string().required('Nom est requis'),
    telephone: Yup.string()
        .required('Téléphone est requis')
        .min(9, 'Le numéro de téléphone doit avoir 9 chiffres')
        .max(12, 'Le numéro de téléphone doit avoir 12 chiffres'),
    email: Yup.string().email("L'email est invalide").required('Email est requis'),
    adresse: Yup.string().required('Adresse est requise'),
    registreDeCommerce: Yup.string().required('Registre de commerce est requise'),
    ninea: Yup.string().required('Ninea est requise'),
 });
const EditFournisseur = () => {
    const navigate = useNavigate();
    const { rootStore: { fournisseurStore } } = useStore();
    const { getData, updateData } = fournisseurStore ;
    const { id } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const { handleSubmit, control, formState: { errors }, reset} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            nom: "",
            email: "",
            telephone: "",
            adresse: "",
            registreDeCommerce:"",
            ninea: "",
        },
    });
  
    const onSubmit = async (data: any) => {
        setFormData(data);
        setOpenDialog(true); // Ouvrir la boîte de dialogue uniquement si pas d'erreurs
    };
    
    
    // Confirmer la mise a jour de l'utilisateur
    const handleConfirm = async () => {
        try {
            if (id && formData) {
                // Effectuer la mise à jour des données
                const resData = await updateData(id, formData);
                console.log("Response Data: ", resData);
                navigate('/accueil/reseau-approvisionnement/fournisseurs')
            } else {
                navigate(-1);
            }
        } catch (error: any) {
            console.log("Erreur lors de la mise à jour :", error);
        } finally {
            setOpenDialog(false); // Fermer la boîte de dialogue après la mise à jour
        }
    };
    // Annuler la création de l'utilisateur
    const handleCancel = () => {
        setOpenDialog(false); // Fermer la boîte de dialogue
    };
    // Initialiser le formulaire avec les données existantes
    const initForm = async () => {
        try {
            if (id) {
                const resData = await getData(id);
                console.log("response data", resData)
                reset(resData.data); // Charger les données existantes des utilisateurs
            }
            else {
                navigate(-1); // Retourner si aucun ID n'est présent
            }
        } catch (error) {
            console.log("Erreur de telechargement des donnees", error);
        }
    };

    useEffect(() => {
        initForm();
    }, [id]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Edition Fournisseur
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="nom"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nom"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.nom}
                                        helperText={errors.nom ? errors.nom.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="telephone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Numéro de téléphone"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.telephone}
                                        helperText={errors.telephone ? errors.telephone.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.email}
                                        helperText={errors.email ? errors.email.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="adresse"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Adresse"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.adresse}
                                        helperText={errors.adresse ? errors.adresse.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="registreDeCommerce"
                            control={control}
                            render={({ field }) => (
                            <TextField
                                {...field}
                                label="Numero registre de commerce"
                                variant="filled"
                                fullWidth
                                margin="normal"
                                error={!!errors.registreDeCommerce}
                                helperText={errors.registreDeCommerce ? errors.registreDeCommerce.message : ''}
                            />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Controller
                        name="ninea"
                        control={control}
                        render={({ field }) => (
                        <TextField
                            {...field}
                            label="Ninea"
                            variant="filled"
                            fullWidth
                            margin="normal"
                            error={!!errors.ninea}
                            helperText={errors.ninea ? errors.ninea.message : ''}
                        />
                        )}
                    />
                    </Grid>
                    </Grid>
                    <Grid xs={12} sm={6} sx={{display:'flex',justifyContent:'center'}}>
                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Enregistrer
                    </Button>
                    <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
                    </Button>
              </Grid>
                </form>
            </CardContent>
            {/* Boîte de dialogue de confirmation */}
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirmer la mise a jour</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment mettre a jour cet fournisseur ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} color="success">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default observer(EditFournisseur);