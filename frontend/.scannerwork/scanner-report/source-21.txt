/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { observer } from "mobx-react-lite";

interface Compartiment {
  id: number;
  volume_compartiment: number;
  numCompartiment: string;
}

interface Camion {
  id: number;
  immatricule: string;
  marque: string;
  capacite: string;
  compartiments: Compartiment[];
}

const EditCamion: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // L'id du camion récupéré depuis l'URL
  const [camion, setCamion] = useState<Camion | null>(null);
  const navigate = useNavigate();
  const { rootStore: { camionStore } } = useStore();
  const { getData, updateData } = camionStore ;
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const { control, handleSubmit, setValue } = useForm<Camion>({
    defaultValues: {
      immatricule: '',
      marque: '',
      capacite: '',
      compartiments: [],
    },
  });

  // Récupérer les données du camion et ses compartiments au chargement
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await getData(id); // Récupérer les données via l'API
        setCamion(result.data); // Mettre à jour l'état
        setValue('immatricule', result.data.immatricule); // Prérenseigner le formulaire
        setValue('marque', result.data.marque);
        setValue('capacite', result.data.capacite);
        setValue('compartiments', result.data.compartiments); // Prérenseigner les compartiments
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: Camion) => {
    setFormData(data);
    setOpenDialog(true); // Ouvrir la boîte de dialogue uniquement si pas d'erreurs
};
  // Méthode pour soumettre les données mises à jour
  const handleConfirm = async () => {
    try {
        if(id){
            await updateData(id, formData); // Mettre à jour le camion et ses compartiments
            navigate('/accueil/reseau-approvisionnement/camions'); // Redirection après la mise à jour
        }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };
// Annuler la mise a  jour du camion
const handleCancel = () => {
  setOpenDialog(false); // Fermer la boîte de dialogue
};
  return (
    <Box sx={{marginLeft:'115px'}} >
      <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
      <Typography variant="h6" color='success' textAlign='center'>Mise à jour du camion</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Formulaire de mise à jour du camion */}
        <Controller
          name="immatricule"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Immatricule"
              variant="filled"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="marque"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Marque"
              variant="filled"
              fullWidth
              margin="normal"
            />
          )}
        />
         <Controller
          name="capacite"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Capacite"
              variant="filled"
              fullWidth
              margin="normal"
            />
          )}
        />

        {/* Affichage et mise à jour des compartiments */}
        <Grid container spacing={2}>
          {camion?.compartiments.map((compartiment, index) => (
            <Grid item xs={12} sm={4} key={compartiment.id}> {/* 4 colonnes pour chaque compartiment */}
              <Controller
                name={`compartiments.${index}.volume_compartiment`} // Accéder aux compartiments par index
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Volume du Compartiment ${index + 1}`}
                    variant="filled"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
              <Controller
                name={`compartiments.${index}.numCompartiment`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Numéro du Compartiment ${index + 1}`}
                    variant="filled"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>

        <Button type="submit" variant="contained" color="success">
          Mettre à jour
        </Button>
        <Button sx={{ mt: 2, ml: 2, background: 'gold' }} variant="contained" onClick={() => { navigate(-1); }}>
                        Retour
        </Button>
      </form>
       {/* Boîte de dialogue de confirmation */}
       <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>Confirmer la mise a jour</DialogTitle>
                <DialogContent>
                    Voulez-vous vraiment mettre a jour cet camion ?
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
    </Box>
    </Box>
  );
};

export default observer(EditCamion);
