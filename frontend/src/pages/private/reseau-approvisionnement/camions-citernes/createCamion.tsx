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
  immatricule: Yup.string().required('Immatriculation est requise'),
  marque: Yup.string().required('Marque est requise'),
  capacite: Yup.string().required('Capacite est requise'),
});
type CamionData = {
    immatricule: string;
    marque: string;
    capacite: string;
  };
const CamionCreate = ({ onNext}: { onNext: (data: CamionData) => void }) => {
  const { handleSubmit, control, formState: { errors }} = useForm({
    resolver: yupResolver(validationSchemaCamion),
    defaultValues: {
      immatricule: '',
      marque: '',
      capacite: '',
    },
  });
  const navigate = useNavigate();
  const onSubmit = (data: CamionData) => {
    onNext(data);// Passer les données du camion au composant parent
    console.log("Données du camion :", data);  
  };

  return (
    <Card sx={{marginLeft:'400px'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom color='success' textAlign='center'>
          Création du camion
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="immatricule"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Immatriculation"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.immatricule}
                    helperText={errors.immatricule ? errors.immatricule.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                    error={!!errors.marque}
                    helperText={errors.marque ? errors.marque.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controller
                name="capacite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="capacite"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.capacite}
                    helperText={errors.capacite ? errors.capacite.message : ''}
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

export default observer(CamionCreate);
