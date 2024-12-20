/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, InputLabel, MenuItem, TextField, Typography, FormControl, Select } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  emetteur: Yup.string().required('Emetteur est requis'),
  designations: Yup.array().of(
    Yup.object().shape({
      designation: Yup.string().required('Designation est requis'),
      quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
    })
  ),
  UniteDeMesure: Yup.string().required('Unite de mesure est requis'),
  numeroBonDeCommande: Yup.string().required('Numero bon de commande est requis'),
});

const BonDeCommandeCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { bonDeCommandeStore, authStore } } = useStore();
  const { createData } = bonDeCommandeStore;
  // Utiliser useState pour la gestion de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  // const { setValue } = useFormContext();
  const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emetteur: "",
      designations: [{ designation: "", quantite: 0, }],
      UniteDeMesure: "",
      numeroBonDeCommande: "",
    },
  });
  // Utiliser useFieldArray pour gérer plusieurs désignations
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'designations',

  });

  useEffect(() => {
    // Fonction asynchrone pour récupérer le numéro de bon de commande
    const fetchNumeroBonDeCommande = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/bons-de-commande/generate-numero-bon-de-commande`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Assure que le numéro de bon de commande est défini dans la réponse avant de le définir
        if (response.data && response.data.numeroBonDeCommande) {
          setValue("numeroBonDeCommande", response.data.numeroBonDeCommande);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du numéro de bon de commande :", error);
      }
    };

    fetchNumeroBonDeCommande(); // Appel initial pour générer le numéro

  }, [setValue, authStore.token]); // Pas de dépendances spécifiques
  // Gestion de la soumission
  const onSubmit = async (data: any) => {
    // Convertir la date au format 'YYYY-MM-DD'
    // if (data.date) {
    //   data.date = new Date(data.date).toISOString().split('T')[0];
    // }
    // Normalisation des données avant envoi
    if (Array.isArray(data.designations)) {
      data.designations = data.designations.map((item: any) => ({
        designation: item.designation,
        quantite: item.quantite,
      }));
    }
    setFormData(data); // Stocker les données pour la boîte de dialogue
    setOpenDialog(true); // Ouvrir la boîte de dialogue
  };
  // Confirmer la création du bon de commande
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
    <Card sx={{ marginLeft: '150px' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Creation de bon de commande
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color="success" textAlign='center' sx={{ marginTop: '10px' }}>
                Désignations
              </Typography>
              {fields.map((field, index) => (
                <Grid container spacing={3} key={field.id}>
                  <Grid item xs={3} sm={4}>
                    <Controller
                      name={`designations.${index}.designation`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Designation"
                          variant="filled"
                          fullWidth
                          {...field}
                          error={!!errors.designations}
                          helperText={errors.designations ? errors.designations.message : ''}
                        >
                          <MenuItem value="Gazoil">Gazoil</MenuItem>
                          <MenuItem value="Super">Super</MenuItem>
                          <MenuItem value="Diesel">Diesel</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2} marginLeft='70px'>
                    <Controller
                      name={`designations.${index}.quantite`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Quantité"
                          variant="filled"
                          fullWidth
                          error={!!errors.designations?.[index]?.quantite}
                          helperText={errors.designations?.[index]?.quantite?.message}
                          sx={{
                            width: '300px', marginRight: 1, '& .MuiOutlinedInput-root': {
                              height: '35px',  // Ajustez la hauteur totale ici
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1} marginLeft='150px'>
                    <Button variant="contained" color="error" onClick={() => remove(index)}>Supprimer</Button>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={1} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <Button variant="contained" color="success" onClick={() => append({ designation: "", quantite: 0 })}>
                  Ajouter une désignation
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="emetteur"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emetteur"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.emetteur}
                    helperText={errors.emetteur ? errors.emetteur.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled" margin="normal">
                <InputLabel>Unité De Mesure</InputLabel>
                <Controller
                  name="UniteDeMesure"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Unité De Mesure"
                      fullWidth
                      value="litre" // Fixe la valeur à "litre"
                      disabled // Désactive la saisie
                    >
                      <MenuItem value="litre">Litre</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="numeroBonDeCommande"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Numero bon de commande"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true, // Champ en lecture seule
                    }}
                    error={!!errors.numeroBonDeCommande}
                    helperText={errors.numeroBonDeCommande ? errors.numeroBonDeCommande.message : ''}
                  />
                )}
              />
            </Grid>
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
          Voulez-vous vraiment créer cet bon de commande ?
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

export default observer(BonDeCommandeCreate);
