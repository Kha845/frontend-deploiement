/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type CompartimentData = {
  volume_compartiment: number;
};

type NewCompartimentData = CompartimentData & {
  numCompartiment: number;
};

type CompartimentCreateProps = {
  onSubmitCompartiment: (data: NewCompartimentData) => void; // Corrigé ici
  nextCompartimentNumber: number;
  maxCamionCapacity: number;
  existingVolumes: number[];
};

const CompartimentCreate = ({
  onSubmitCompartiment,
  nextCompartimentNumber,
  maxCamionCapacity,
  existingVolumes
}: CompartimentCreateProps) => {
  
  const [currentTotalVolume, setCurrentTotalVolume] = useState(0);

  // Calculer la somme des volumes actuels des compartiments existants
  useEffect(() => {
    const totalVolume = existingVolumes.reduce((acc, volume) => acc + volume, 0);
    setCurrentTotalVolume(totalVolume);
  }, [existingVolumes]);

  // Schéma de validation Yup incluant la vérification de la capacité
  const validationSchemaCompartiment = Yup.object().shape({
    volume_compartiment: Yup.number()
      .required('Volume du compartiment est requis')
      .positive('Le volume doit être un nombre positif')
      .test(
        'max-capacity',
        `La somme totale des volumes ne doit pas dépasser la capacité maximale de ${maxCamionCapacity}`,
        (value) => {
          return currentTotalVolume + (value || 0) <= maxCamionCapacity;
        }
      ),
  });

  const { handleSubmit, control, formState: { errors } } = useForm<CompartimentData>({
    resolver: yupResolver(validationSchemaCompartiment),
    defaultValues: {
      volume_compartiment: 0,
    },
  });

  const onSubmit = (data: CompartimentData) => {
    const newCompartimentData: NewCompartimentData = {
      ...data,
      numCompartiment: nextCompartimentNumber
    };
    onSubmitCompartiment(newCompartimentData);
  };
  const navigate = useNavigate();
  return (
    <Card sx={{display:'flex',justifyContent:'center',alignItems:'center', marginLeft:'600px'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom color="success" textAlign='center' >
          Création des compartiments
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Capacité maximale du camion : {maxCamionCapacity} | Volume total actuel : {currentTotalVolume}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Numéro Compartiment : {nextCompartimentNumber}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="volume_compartiment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Volume Compartiment"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!!errors.volume_compartiment}
                    helperText={errors.volume_compartiment ? errors.volume_compartiment.message : ''}
                    inputProps={{ 
                      min: 0 // S'assurer que les valeurs ne soient pas négatives
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button sx={{ mt: 2, mb: 2 }} type="submit" variant="contained" color="success">
            Ajouter le compartiment
          </Button>
          <Button sx={{ mt: 2, ml: 2, background: 'gold', lg:'3' }} variant="contained" onClick={() => { navigate(-1); }}>
            Retour
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default observer(CompartimentCreate);
