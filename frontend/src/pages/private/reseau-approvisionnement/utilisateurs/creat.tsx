/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, MenuItem, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useStore } from '../../../../store/rootStore';
import {Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
  prenom: Yup.string().required('Prénom est requis'),
  nom: Yup.string().required('Nom est requis'),
  telephone: Yup.string().required('Téléphone est requis').min(9, 'Le numéro de téléphone doit avoir 9 chiffres').max(12, 'Le numéro de téléphone doit avoir 12 chiffres'),
  email: Yup.string().email("L'email est invalide").required('Email est requis'),
  adresseSGF: Yup.string().required('Adresse est requise'),
  matricule: Yup.string(),
  poste: Yup.string().required('Le poste est requis'),
  autrePoste: Yup.string(),
  // Ajout de la validation pour le mot de passe
  password: Yup.string()
    .required('Mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
    .matches(/[@$!%*?&#]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
});

const UtilisateursCreate = () => {
  const navigate = useNavigate();
  const { rootStore: { utilisateurStore, authStore } } = useStore();
  const { createData } = utilisateurStore;
    // Utiliser useState pour la gestion de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
 // const [selectedPoste, setSelectedPoste] = useState('');
  const [showAutrePoste, setShowAutrePoste] = useState(false); // État pour gérer la visibilité
  const [posteSaisi, setPosteSaisi] = useState(''); // État pour stocker le poste saisi
  const [postes, setPostes] = useState([
    'DG', 
    'DGA', 
    'Chef Comptable', 
    'Agent Comptable', 
    'Secretaire', 
    'Assistant', 
    'Autre'
  ]);


  const handlePosteChange = (event:any) => {
    const value = event.target.value;
    setShowAutrePoste(value === 'Autre');
    setPosteSaisi(value); // Mettez à jour le poste saisi
  };
  const { handleSubmit, control, formState: { errors }, reset , setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      matricule: "",
      poste: "",
      autrePoste: '',
      adresseSGF: "",
      password: "",
    },
  });
  const nom = watch('nom'); // Surveille la valeur du champ nom
  useEffect(() => {
    // Appelle l'API pour générer le matricule dès que 'nom' change
    if (nom) {
      axios.post(`${import.meta.env.VITE_API_URL}/v1/users/generate-matricule`, { nom },{
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setValue('matricule', response.data.matricule); // Met à jour le champ matricule
        })
        .catch(error => {
          console.error("Erreur lors de la génération du matricule :", error);
        });
    }
  }, [nom, setValue]);
    // Gestion de la soumission
   const onSubmit = async (data: any) => {
      // Vérifiez si "poste" est "Autre" et remplacez la valeur
    if (data.poste === 'Autre' && data.autrePoste) {
      data.poste = data.autrePoste; // Remplace la valeur du champ "poste"
      setPostes((prevPostes) => {
        if (!prevPostes.includes(data.poste)) {
          console.log('Nouveau poste',data.poste)
          return [...prevPostes.filter(p => p !== 'Autre'), data.poste, 'Autre'];
        }
        return prevPostes; // Retourne les postes existants si déjà présent
      });
    }
   // Supprimez le champ "autrePoste" avant d'envoyer au backend
    delete data.autrePoste;
      setFormData(data); // Stocker les données pour la boîte de dialogue
      setOpenDialog(true); // Ouvrir la boîte de dialogue
    };
   // Confirmer la création de l'utilisateur
   const handleConfirm = async () => {
    try {
      const resMessage = await createData(formData); // Appel API avec les données
      console.log(resMessage);
      reset();
      setShowAutrePoste(false);
      setPosteSaisi('');
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
          Creation Utilisateur
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="prenom"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Prénom"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.prenom}
                    helperText={errors.prenom ? errors.prenom.message : ''}
                  />
                )}
              />
            </Grid>

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
                label="telephone"
                variant="filled"
                fullWidth
                margin="normal"
               
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
                name="adresseSGF"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Adresse"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.adresseSGF}
                    helperText={errors.adresseSGF ? errors.adresseSGF.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="matricule"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Matricule"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true, // Champ en lecture seule
                    }}
                    error={!!errors.matricule}
                    helperText={errors.matricule ? errors.matricule.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Champ pour le mot de passe */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mot de passe"
                    type="password"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="poste"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Poste"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    select
                    onChange={(event) => {
                      handlePosteChange(event);
                      field.onChange(event); // Propagation de l'événement à React Hook Form
                    }}
                    error={!!errors.poste}
                    helperText={errors.poste ? errors.poste.message : ''}
                  >
                {postes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                  ))}
                  </TextField>
                )}
              />
          </Grid>
          {/* Champ conditionnel pour saisir un nom de poste si "Autre" est sélectionné */}
            {showAutrePoste && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="autrePoste" // Nom pour le champ de saisie conditionnel
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Veuillez spécifier le poste"
                      variant="filled"
                      fullWidth
                      margin="normal"
                      error={!!errors.autrePoste}
                      helperText={errors.autrePoste ? errors.autrePoste.message : ''}
                      onChange={(event) => {
                        setPosteSaisi(event.target.value); // Mettez à jour l'état pour le poste saisi
                        field.onChange(event); // Propagation de l'événement à React Hook Form
                      }}
                    />
                  )}
                />
              </Grid>
            )}
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
          Voulez-vous vraiment créer cet utilisateur ?
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

export default observer(UtilisateursCreate);
