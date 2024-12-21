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
    typePaiement: Yup.string().required('Type est requis'),
    heure: Yup.string()
        .required("L'heure est obligatoire"),
    date: Yup.date().required('Date est requis'),
  });
const EditModeDePaiement = () => {
    const navigate = useNavigate();
    const { rootStore: { modeDePaiementStore } } = useStore();
    const { getData, updateData } = modeDePaiementStore;
    const { id } = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    const { handleSubmit, control, formState: { errors }, reset} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
          typePaiement: "",
          date: new Date,
          heure: "",
        },
      });
    const onSubmit = async (data: any) => {
        if (data.date) {
            data.date = new Date(data.date).toISOString().split('T')[0];
          }
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
                navigate('/accueil/transaction/mode-paiement')
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
                reset({
                    typePaiement: resData.data.typePaiement,
                    date: resData.data.date,
                    heure: resData.data.heure
                }); // Charger les données existantes des utilisateurs
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
                <Typography variant="h4" gutterBottom color='success'>
                    Edition de bon de commande
                </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Controller
                name="typePaiement"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Type Paiement"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.typePaiement}
                    helperText={errors. typePaiement ? errors.typePaiement.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    type='date'
                    error={!!errors.date}
                    helperText={errors.date ? errors.date.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="heure"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Heure"
                    type="time"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.heure}
                    helperText={errors.heure ? errors.heure.message : ''}
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
                    Voulez-vous vraiment mettre a jour cet mode de paiement ?
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

export default observer(EditModeDePaiement);