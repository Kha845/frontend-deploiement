/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  nb_agents: Yup.number().required('Nombre agent est requis'),
  nb_de_mois: Yup.number().required('Nombre de mois'),
  cotisation_adherant: Yup.number().required('Cotisation adherant'),
  cotisation_employeur: Yup.number().required('Cotisation employeur'),
  total_cotisations: Yup.number().required('Cotisation total'),
});

const IpmCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { ipmStore } } = useStore();
  const { createData } = ipmStore;
  // Utiliser useState pour la gestion de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const { handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nb_agents: 0,
      nb_de_mois: 0,
      cotisation_adherant: 0,
      cotisation_employeur: 0,
      total_cotisations: 0,
    },
  });
  // Gestion de la soumission
  const onSubmit = async (data: any) => {
    setFormData(data); // Stocker les données pour la boîte de dialogue
    setOpenDialog(true); // Ouvrir la boîte de dialogue
  };
  // Confirmer la création du fournisseur
  const handleConfirm = async () => {
    try {
      const resMessage = await createData(formData); // Appel API avec les données
      console.log(resMessage);
      reset();
      setOpenDialog(false); // Fermer la boîte de dialogue
    } catch (error: any) {
      console.log(error);
    }
  };
  // Annuler la création du fournisseur
  const handleCancel = () => {
    setOpenDialog(false); // Fermer la boîte de dialogue
  };
 // Regarder les champs adhérent et employeur pour recalculer
 const cotisationAdherant = watch('cotisation_adherant');
 const cotisationEmployeur = watch('cotisation_employeur');

 useEffect(() => {
   const cotisationTotal = Number(cotisationAdherant) + Number(cotisationEmployeur);
   setValue('total_cotisations', cotisationTotal, { shouldValidate: true });
 }, [cotisationAdherant, cotisationEmployeur, setValue]);
  return (
    <Card sx={{ marginLeft: '400px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color='success' textAlign='center'>
          Creation d'ipm
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nb_agents"
                control={control}
                render={({ field }) => (
                  <TextField
                    type='number'
                    {...field}
                    label="Nombre agents"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.nb_agents}
                    helperText={errors.nb_agents ? errors.nb_agents.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nb_de_mois"
                control={control}
                render={({ field }) => (
                  <TextField
                    type='number'
                    {...field}
                    label="Nombre de mois"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.nb_de_mois}
                    helperText={errors.nb_de_mois ? errors.nb_de_mois.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cotisation_adherant"
                control={control}
                render={({ field }) => (
                  <TextField
                    type='number'
                    {...field}
                    label="Cotisation adherant"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.cotisation_adherant}
                    helperText={errors.cotisation_adherant ? errors.cotisation_adherant.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cotisation_employeur"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cotisation employeur"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.cotisation_employeur}
                    helperText={errors.cotisation_employeur ? errors.cotisation_employeur.message : ''}
                    
                    />
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Controller
              name='total_cotisations'
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Cotisation Total"
                  variant="filled" fullWidth disabled
                  error={!!errors.total_cotisations} /> 
              )}
            />
          </Grid>
          <Grid xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
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
        <DialogTitle>Confirmer la création</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment créer cette  ipm ?
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

export default observer(IpmCreate);
