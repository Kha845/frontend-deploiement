/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  destinataire: Yup.string().required('Destinataire est requis'),
  designations: Yup.array().of(
    Yup.object().shape({
      designation: Yup.string().required('Designation est requis'),
      quantite: Yup.number().required('Quantite est requis').min(1, 'Quantité doit être au moins 1'),
    })
  ),
  UniteDeMesure: Yup.string().required('Unite de mesure est requis'),
  numeroBonDeLivraison: Yup.number().required('Numero bon de livraison est requis'),
});
const EditBonDeLivraison = () => {
  const navigate = useNavigate();
  const { rootStore: { bonDeLivraisonStore } } = useStore();
  const { getData, updateData } = bonDeLivraisonStore;
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  // const [camions, setCamions] = useState<Camions[]>([]);
  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      destinataire: "",
      designations: [{ designation: "", quantite: 0, }],
      UniteDeMesure: "",
      // idCamionCiterne: "",
      numeroBonDeLivraison: 0,
    },
  });
  // Utiliser useFieldArray pour gérer plusieurs désignations
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'designations',

  });

  const onSubmit = async (data: any) => {
    setFormData(data);
    setOpenDialog(true); // Ouvrir la boîte de dialogue uniquement si pas d'erreurs
  };
  const handleConfirm = async () => {
    try {
      if (id && formData) {
        // Effectuer la mise à jour des données
        const resData = await updateData(id, formData);
        console.log("Response Data: ", resData);
        navigate('/accueil/transaction/bon-livraison');
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
        let designations = resData.data.designations;
        if (typeof designations === "string") {
          designations = JSON.parse(designations);
        }
        reset({
          destinataire: resData.data.destinataire,
          designations: designations.map((item: any) => ({
            designation: item.designation || "",
            quantite: item.quantite || 0,
          })),
          UniteDeMesure: resData.data.UniteDeMesure,
          // dateLivraison: resData.data.dateLivraison,
          // heure: resData.data.heure,
          numeroBonDeLivraison: resData.data.numeroBonDeLivraison,
          // idCamionCiterne: resData.data.camion_citerne.id,
        });
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
    <Card sx={{ width: '100%'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Edition de bon  de livraison
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
                  <Grid item xs={3}>
                    <Controller
                      name={`designations.${index}.quantite`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Quantite"
                          variant="filled"
                          fullWidth
                          error={!!errors.designations?.[index]?.quantite}
                          helperText={errors.designations?.[index]?.quantite?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button variant="contained" color="error" onClick={() => remove(index)}>Supprimer</Button>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={1} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <Button variant="contained" color="success" onClick={() => append({ designation: "", quantite: 0, })}>
                  Ajouter une désignation
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled" margin="normal" error={!!errors.designations}>
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled" margin="normal" error={!!errors.UniteDeMesure}>
                <InputLabel>Unité De Mesure</InputLabel>
                <Controller
                  name="UniteDeMesure"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Unité De Mesure"
                      fullWidth
                    >
                      <MenuItem value="litre">Litre</MenuItem>
                      <MenuItem value="hectolitre">Hectolitre</MenuItem>
                      <MenuItem value="metre cube">Mètre Cube</MenuItem>
                      <MenuItem value="tonne">Tonne</MenuItem>
                    </Select>
                  )}
                />
                {errors.UniteDeMesure && (
                  <FormHelperText>{errors.UniteDeMesure.message}</FormHelperText>
                )}
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
            <Grid item xs={12} sm={6}>
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
              Mise a jour
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
          Voulez-vous vraiment mettre a jour cet bon de livraison ?
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

export default observer(EditBonDeLivraison);