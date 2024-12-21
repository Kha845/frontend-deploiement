/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
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
  destinataire: Yup.string().required('Le destinataire est requis'),
  UniteDeMesure: Yup.string().required('Unite de mesure est requis').nullable(),
  // idCamionCiterne: Yup.string().required('Camion est requis'),
  numeroBonDeLivraison: Yup.number().required('Numero bon de livraison est requis'),
  designations: Yup.array().of(
    Yup.object().shape({
      designation: Yup.string().required('Designation est requis'),
      quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
    })
  )
});
interface Camions {
  id: number;
  immatricule: string;
}
const BonDeLivraisonCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { bonDeLivraisonStore, authStore } } = useStore();
  const { createData } = bonDeLivraisonStore;
  // Utiliser useState pour la gestion de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  // const [camions, setCamions] = useState<Camions[]>([]);
  const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      destinataire: "",
      designations: [{ designation: "", quantite: 0, }],
      UniteDeMesure: "litre",
      // idCamionCiterne: "",
      numeroBonDeLivraison: 0,
    },
  });
  // Utiliser useFieldArray pour gérer plusieurs désignations
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'designations',

  });

  useEffect(() => {
    // Fonction asynchrone pour récupérer le numéro de bon de livraison
    const fetchNumeroBonDeLivraison = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/bons-de-livraison/generate-numero-bon-de-livraison`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Assure que le numéro de bon de commande est défini dans la réponse avant de le définir
        if (response.data && response.data.numeroBonDeLivraison) {
          setValue("numeroBonDeLivraison", response.data.numeroBonDeLivraison);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du numéro de bon de livraison :", error);
      }
    };

    fetchNumeroBonDeLivraison(); // Appel initial pour générer le numéro
   

  }, [setValue, authStore.token]);
  // // Fonction pour récupérer la liste des camions
  // const fetchCamions = async () => {
  //   try {
  //     const response = await bonDeLivraisonStore.getListCamions();
  //     setCamions(response); // Assurez-vous d'adapter cette ligne selon la structure de votre réponse
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des camions:', error);
  //   }
  // };
  // // Utiliser useEffect pour charger les camions au montage du composant
  // useEffect(() => {
  //   fetchCamions();
  // }, []);
  // Gestion de la soumission
  const onSubmit = async (data: any) => {
    // Convertir la date au format 'YYYY-MM-DD'
    // if (data.dateLivraison) {
    //   data.dateLivraison = new Date(data.dateLivraison).toISOString().split('T')[0];
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
      navigate('/accueil/transaction/bon-livraison');
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
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Creation de bon de livraison
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled" margin="normal" error={!!errors.destinataire}>
                <InputLabel>Destinataire</InputLabel>
                <Controller
                  name="destinataire"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Destinataire"
                      fullWidth
                    >
                      <MenuItem value="senstock">SenStock</MenuItem>
                      <MenuItem value="dot">DOT</MenuItem>
                      <MenuItem value="oryx">ORYX</MenuItem>

                    </Select>
                  )}
                />
                {errors.destinataire && (
                  <FormHelperText>{errors.destinataire.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
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
                      disabled // Désactive la saisie
                    >
                      <MenuItem value="litre">Litre</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name="idCamionCiterne"
                control={control}
                render={({ field }) => (
                  <FormControl variant="filled" fullWidth margin="normal" error={!!errors.idCamionCiterne}>
                    <InputLabel id="camion-select-label">Sélectionnez un camion</InputLabel>
                    <Select
                      {...field}
                      labelId="camion-select-label"
                      fullWidth
                    >
                      {camions.map((camion: any) => (
                        <MenuItem key={camion.id} value={camion.id}>
                          {camion.immatricule} 
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.idCamionCiterne && <p style={{ color: 'red' }}>{errors.idCamionCiterne.message}</p>}
                  </FormControl>
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <Controller
                name="numeroBonDeLivraison"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Numero bon de livraison"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true, // Champ en lecture seule
                    }}
                    error={!!errors.numeroBonDeLivraison}
                    helperText={errors.numeroBonDeLivraison ? errors.numeroBonDeLivraison.message : ''}
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
          Voulez-vous vraiment créer cet bon de livraison ?
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
export default observer(BonDeLivraisonCreate);
