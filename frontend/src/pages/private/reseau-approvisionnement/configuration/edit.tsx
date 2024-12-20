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
    nom_role: Yup.string().required('Nom est requis'),
 });
const EditConfig = () => {
    const navigate = useNavigate();
    const { rootStore: { configStore  } } = useStore();
    const { getData, updateData } =  configStore  ;
    const { id } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const { handleSubmit, control, formState: { errors }, reset} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            nom_role: "",
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
                navigate('/accueil/reseau-approvisionnement/configuration')
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
                console.log("response data", resData.data)
                reset({ nom_role: resData.data.nom_role}); // Charger les données existantes des roles
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
                <Typography variant="h6" gutterBottom color='success'>
                    Edition Role
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="nom_role"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nom"
                                        variant="filled"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.nom_role}
                                        helperText={errors.nom_role ? errors.nom_role.message : ''}
                                        sx={{ width: '400px', height: '56px' }} 
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
                        Mise a jour
                    </Button>
                    <Button sx={{ mt: 2, ml: 2, background: 'gold' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
                    </Button>
                </form>
            </CardContent>
            {/* Boîte de dialogue de confirmation */}
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirmer la mise a jour</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment mettre a jour cet role ?
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

export default observer(EditConfig);