/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { observer } from "mobx-react-lite";

interface Depot {
  id: number;
  nom: number;
  adresse: string;
}

interface Stockeur {
  idStokeur: number;
  nom: string;
  telephone: string;
  adresse: string;
  depots: Depot[];
}

const EditStockeur: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // L'id du camion récupéré depuis l'URL
  const [stockeur, setStockeur] = useState<Stockeur | null>(null);
  const navigate = useNavigate();
  const { rootStore: { stockeurStore } } = useStore();
  const { getData, updateData } = stockeurStore ;
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const { control, handleSubmit, setValue } = useForm<Stockeur>({
    defaultValues: {
      nom: '',
      telephone: '',
      adresse: '',
      depots: [],
    },
  });

  // Récupérer les données du camion et ses compartiments au chargement
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await getData(id); // Récupérer les données via l'API
        setStockeur(result.data); // Mettre à jour l'état
        setValue('nom', result.data.nom); // Prérenseigner le formulaire
        setValue('telephone', result.data.telephone);
        setValue('adresse', result.data.adresse);
        setValue('depots', result.data.depots); // Prérenseigner les compartiments
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: Stockeur) => {
    setFormData(data);
    setOpenDialog(true); // Ouvrir la boîte de dialogue uniquement si pas d'erreurs
};
  // Méthode pour soumettre les données mises à jour
  const handleConfirm = async () => {
    try {
        if(id){
            await updateData(id, formData); // Mettre à jour le camion et ses compartiments
            navigate('/accueil/stock/stockeur'); // Redirection après la mise à jour
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
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', marginLeft: '350px' }}>
      <Typography variant="h4" color='success' textAlign='center'>Mise à jour du stockeur</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Formulaire de mise à jour du camion */}
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
            />
          )}
        />
        <Controller
          name="telephone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Telephone"
              variant="filled"
              fullWidth
              margin="normal"
            />
          )}
        />
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
            />
          )}
        />

        {/* Affichage et mise à jour des compartiments */}
        <Grid container spacing={2}>
          {stockeur?.depots.map((depot, index) => (
            <Grid item xs={12} sm={4} key={depot.id}> {/* 4 colonnes pour chaque compartiment */}
              <Controller
                name={`depots.${index}.nom`} // Accéder aux compartiments par index
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Nom Depot ${index + 1}`}
                    variant="filled"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
              <Controller
                name={`depots.${index}.adresse`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Adresse Depot ${index + 1}`}
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
                    Voulez-vous vraiment mettre a jour cet stockeur ?
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
  );
};

export default observer(EditStockeur);
