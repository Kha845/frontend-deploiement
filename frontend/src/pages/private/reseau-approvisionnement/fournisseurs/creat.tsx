/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import {Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  nom: Yup.string().required('Nom est requis'),
  telephone: Yup.string().required('Téléphone est requis').min(9, 'Le numéro de téléphone doit avoir 9 chiffres').max(12, 'Le numéro de téléphone doit avoir 12 chiffres'),
  email: Yup.string().email("L'email est invalide").required('Email est requis'),
  adresse: Yup.string().required('Adresse est requise'),
  registreDeCommerce: Yup.string().required('Registre de commerce est requise'),
  ninea: Yup.string().required('Ninea est requise'),
});

const FournisseurCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { fournisseurStore} } = useStore();
  const { createData } = fournisseurStore;
    // Utiliser useState pour la gestion de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const { handleSubmit, control, formState: { errors }, reset  } = useForm({
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
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom color='success' textAlign='center'>
          Creation du fournisseur
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
        <DialogTitle>Confirmer la création</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment créer cet fournisseur ?
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

export default observer(FournisseurCreate);
