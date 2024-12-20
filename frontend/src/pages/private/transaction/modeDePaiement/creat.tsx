/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent,TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import {Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  typePaiement: Yup.string().required('Type est requis'),
  date: Yup.date().required('Date est requis'),
  heure: Yup.string()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "L'heure doit être au format HH:mm")
      .required("L'heure est obligatoire"),
 
});

const ModeDePaiementCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { modeDePaiementStore} } = useStore();
  const { createData } = modeDePaiementStore;
    // Utiliser useState pour la gestion de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      typePaiement: "",
      date: new Date,
      heure: "",
    },
  });
    // Gestion de la soumission
   const onSubmit = async (data: any) => {
       // Convertir la date au format 'YYYY-MM-DD'
      if (data.date) {
        data.date = new Date(data.date).toISOString().split('T')[0];
      }
      setFormData(data); // Stocker les données pour la boîte de dialogue
      setOpenDialog(true); // Ouvrir la boîte de dialogue
    };
   // Confirmer la création le mode de paiement
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
   // Annuler la création de l'utilisateur
   const handleCancel = () => {
    setOpenDialog(false); // Fermer la boîte de dialogue
  };
  return (
    <Card  sx={{marginLeft: '550px'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Creation de mode de paiement
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
                    helperText={errors.typePaiement ? errors.typePaiement.message : ''}
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
        <DialogTitle>Confirmer la création</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment créer cet mode de paiement ?
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

export default observer(ModeDePaiementCreate);
