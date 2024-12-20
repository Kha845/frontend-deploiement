/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';

type DepotData = {
    nom: string; // Ajoutez d'autres champs selon vos besoins
    adresse: string; // Exemple de type
  };
// Validation du formulaire de création de depot
const validationSchemaDepot = Yup.object().shape({
  nom: Yup.string().required('Nom Depot est requise'),
  adresse: Yup.string().required('Adresse Depot est requis'),
});

const DepotCreate = ({ onSubmitDepot }: { onSubmitDepot: (data: DepotData) => void }) => {
  const { handleSubmit, control, formState: { errors }, reset} = useForm({
    resolver: yupResolver(validationSchemaDepot),
    defaultValues: {
     nom: '',
     adresse: '',
    },
  });

  const onSubmit = (data: DepotData) => {
    onSubmitDepot(data); // Passer les données du depot au composant parent
    reset();
  };
  return (
    <Card sx={{marginLeft: '650px'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Création des Depots
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
                    type='text'
                    label="Nom Depot"
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
                name="adresse"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Adresse Depot"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.adresse}
                    helperText={errors.adresse ? errors.adresse.message : ''}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button sx={{ mt: 2, mb: 2 }} type="submit" variant="contained" color="success">
            Ajouter le depot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default observer(DepotCreate);
