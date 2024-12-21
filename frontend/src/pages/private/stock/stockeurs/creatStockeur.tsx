/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// Validation du formulaire de création de camion
const validationSchemaCamion = Yup.object().shape({
  nom: Yup.string().required('Nom est requise'),
  telephone: Yup.string().required('Téléphone est requis').min(9, 'Le numéro de téléphone doit avoir 9 chiffres').max(12, 'Le numéro de téléphone doit avoir 12 chiffres'),
  adresse: Yup.string().required('Adresse est requise'),
});
type StockeurData = {
    nom: string;
    telephone: string;
    adresse: string;
  };
const StockeurCreate = ({ onNext}: { onNext: (data: StockeurData) => void }) => {
  const { handleSubmit, control, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchemaCamion),
    defaultValues: {
      nom: '',
      telephone: '',
      adresse: '',
    },
  });
  const navigate = useNavigate();
  const onSubmit = (data: StockeurData) => {
    onNext(data);// Passer les données du camion au composant parent
    console.log("Données du stockeur :", data);  
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Création de stockeur
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
                    label="Telephone"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.telephone}
                    helperText={errors.telephone ? errors.telephone.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
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
          </Grid>

          <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
            Suivant
          </Button>
          <Button sx={{ mt: 2, ml: 2, background: 'gold', lg:'3' }} variant="contained" onClick={() => { navigate(-1); }}>
            Retour
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default observer(StockeurCreate);
