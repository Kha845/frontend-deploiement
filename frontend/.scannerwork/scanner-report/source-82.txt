/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react-lite';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// import { useStore } from '../../../../store/rootStore';
// import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect } from 'react';
// import { toast } from 'react-toastify';

// Définir la validation du formulaire
const validationSchema = Yup.object().shape({
    cumul_cfa_noir: Yup.number(),
    cumul_cfa_blanc: Yup.number(),
    cumul_total: Yup.number(),
    designations: Yup.array().of(
        Yup.object().shape({
            designation: Yup.string(),
            volume_ambiant: Yup.number(),
            volume_a_15_kg: Yup.number(),
            taux_blanc: Yup.number(),
            taux_noir: Yup.number(),
            montant_blanc: Yup.number(),
            montant_noir: Yup.number(),
        })
    )
});

// Définition du type Designation
type Designation = {
    designation: string; // Nom de l'article ou carburant
    volume_ambiant: number;    
    volume_a_15_kg: number; 
    taux_blanc: number;     
    taux_noir: number;
    montant_blanc: number;
    montant_noir: number;
};

// Définition du type des frais de passage
interface FraisPassage {
    cumul_cfa_noir: number;
    cumul_cfa_blanc: number;
    designations: Designation[];
}

interface FactureAvecPassageEtFraisProps {
    onChange: (data: FraisPassage[]) => void; // Accepte un tableau
    onSubmit: () => void; // Soumission finale
}

const FactureAvecPassage: React.FC<FactureAvecPassageEtFraisProps> = ({ onChange, onSubmit }) => {
    const navigate = useNavigate();
    const { handleSubmit, control, formState: { errors }, reset, setValue, watch } = 
    useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            cumul_cfa_noir: 0,
            cumul_cfa_blanc: 0,
            cumul_total: 0,
            designations: [{
                designation: "",
                volume_ambiant: 0,
                volume_a_15_kg: 0,
                taux_noir: 0,
                taux_blanc: 0,
                montant_blanc: 0,
                montant_noir: 0,
            }],
        },
    });
    // Utiliser useFieldArray pour gérer plusieurs désignations
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'designations'
    });

    // Calcul du cumul total
    const calculateCumuleTotale = () => {
        const designations = watch("designations") || [];
        const total = designations.reduce((acc, designation) => {
            const montantNoir = Number(designation.montant_noir)|| 0;
            const montantBlanc = Number(designation.montant_blanc) || 0;
            return acc + montantNoir + montantBlanc;
        }, 0);
        console.log('montant total',total);
        return parseFloat(total.toFixed(2));
    };

    // Calcul du cumul CFA (Taux Noir)
    const calculateCumuleCfaNoir = () => {
        const designations = watch("designations") || [];
        const totalCfaNoir = designations.reduce((acc, designation) => {
            const montantNoir = Number(designation.montant_noir) || 0;
            
            return acc + montantNoir;
        }, 0);
        return parseFloat(totalCfaNoir.toFixed(2));
    };

    // Calcul du cumul CFA (Taux Blanc)
    const calculateCumuleCfaBlanc = () => {
        const designations = watch("designations") || [];
        const totalCfaBlanc = designations.reduce((acc, designation) => {
            const montantBlanc = Number(designation.montant_blanc) || 0;
           
            return acc + montantBlanc;
        }, 0);
        return parseFloat(totalCfaBlanc.toFixed(2));
    };

    // Calculs mis à jour
    useEffect(() => {
        setValue("cumul_total", calculateCumuleTotale());
        setValue("cumul_cfa_noir", calculateCumuleCfaNoir());
        setValue("cumul_cfa_blanc", calculateCumuleCfaBlanc());
    }, [watch("designations")]); // recalculer à chaque modification de designations

    const onFormSubmit = (data: any) => {
        onChange(data.designations); // Envoie les données au parent
        onSubmit(); // Enregistre tout
       // reset();
    };

    return (
        <Card sx={{ marginLeft: '150px' }}>
            <CardContent>
                {/* <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Enregistrement d'une nouvelle facture stockeur
                </Typography> */}
                <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="success" textAlign='center'>
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
                                                    error={!!errors.designations?.[index]?.designation}
                                                    helperText={errors.designations?.[index]?.designation?.message}
                                                >
                                                    <MenuItem value="Gazoil">Gazoil</MenuItem>
                                                    <MenuItem value="Super">Super</MenuItem>
                                                    <MenuItem value="Diesel">Diesel</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.volume_ambiant`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type='number'
                                                    {...field}
                                                    label="Quantité volume ambiant"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.volume_ambiant}
                                                    helperText={errors.designations?.[index]?.volume_ambiant?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.volume_a_15_kg`}
                                            control={control}
                                            
                                            render={({ field }) => (
                                                <TextField
                                                    type='number'
                                                    {...field}
                                                    label="Quantite volume a 15"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.volume_a_15_kg}
                                                    helperText={errors.designations?.[index]?.volume_a_15_kg?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.taux_blanc`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Taux blanc"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.taux_blanc}
                                                    helperText={errors.designations?.[index]?.taux_blanc?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.taux_noir`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Taux noir"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.taux_noir}
                                                    helperText={errors.designations?.[index]?.taux_noir?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.montant_noir`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Montant noir"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.montant_noir}
                                                    helperText={errors.designations?.[index]?.montant_noir?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Controller
                                            name={`designations.${index}.montant_blanc`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                 type='number'
                                                    {...field}
                                                    label="Montant blanc"
                                                    variant="filled"
                                                    fullWidth
                                                    error={!!errors.designations?.[index]?.montant_blanc}
                                                    helperText={errors.designations?.[index]?.montant_blanc?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={1} sm={1}>
                                        <Button onClick={() => remove(index)} color="error" variant="contained" sx={{ marginTop: "35px" }}>
                                            Supprimer
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>

                        <Grid item xs={12} sx={{ marginTop: '20px' }}>
                            <Button
                                onClick={() => append({
                                    designation: "",
                                    volume_ambiant: 0,
                                    volume_a_15_kg: 0,
                                    taux_noir: 0,
                                    taux_blanc: 0,
                                    montant_blanc: 0,
                                    montant_noir: 0,
                                })}
                                color="success"
                                variant="contained"
                            >
                                Ajouter une désignation
                            </Button>
                        </Grid>

                        {/* Cumul total */}
                        <Grid item xs={12}>
                            <TextField
                                label="Cumul CFA Noir"
                                value={watch("cumul_cfa_noir")}
                                fullWidth
                                variant="filled"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Cumul CFA Blanc"
                                value={watch("cumul_cfa_blanc")}
                                fullWidth
                                variant="filled"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Cumul Total"
                                value={watch("cumul_total")}
                                fullWidth
                                variant="filled"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Soumettre
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default observer(FactureAvecPassage);
