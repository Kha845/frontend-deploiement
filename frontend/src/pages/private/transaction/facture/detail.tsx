/* eslint-disable react-refresh/only-export-components */
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { useNavigate, useParams } from 'react-router-dom';

// Définir les types des données
interface Designation {
  designation: string;
  quantite: number;
  prixUnitaire: number;
  montant: number;
  devise: string;
  volume_ambiant: number;
}

interface FactureData {
  emetteur: string;
  destinataire: string | null;
  reference: string | null;
  date: string;
  format: string;
  designations: Designation[];
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
}

const DetailFacture = () => {
    const { rootStore: { factureStore } } = useStore();
    const [data, setData] = useState<FactureData | null>(null); // Initialiser avec FactureData ou null
    const { getData } = factureStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const TVA_RATE = 0.18; // Taux de TVA à 18%

    const details = async () => {
        try {
            if (id) {
                const resData = await getData(id);

                // Vérifiez si les données existent et parsez 'designations' si c'est une chaîne JSON
                const parsedDesignations = resData.data.designations ? JSON.parse(resData.data.designations) : [];

                // Calculer le Montant HT total (somme des montants dans les désignations)
                const totalMontantHT = parsedDesignations.reduce((acc: number, item: Designation) => acc + item.montant, 0);

                // Calculer la TVA et TTC à partir du Montant HT
                const montantTVA = totalMontantHT * TVA_RATE;
                const montantTTC = totalMontantHT + montantTVA;

                // Mettez à jour l'état avec les données traitées
                setData({
                    ...resData.data,
                    designations: parsedDesignations,
                    montantHT: totalMontantHT,
                    montantTVA: montantTVA,
                    montantTTC: montantTTC,
                });
            }
        } catch (error) {
            console.log("Erreur de téléchargement des données", error);
        }
    };

    useEffect(() => {
        details();
    }, [id]);

    // Vérifier si les données sont disponibles avant de les afficher
    if (!data) {
        return <Box textAlign='center' mt={5} marginLeft='790px'><CircularProgress /></Box>;
      }
    return (
        <Card sx={{ marginLeft: '150px', marginTop: 2, width: '130%' }}>
                <Box display='flex' justifyContent='start-end' alignItems='right'>
                <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                            Retour
                </Button>
               </Box>
            <CardContent sx={{width: '100%'}}>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Détails de facture
                </Typography>
                <Box mb={3}>
                    <Grid container spacing={2}>
                        {/* Informations de l'émetteur, destinataire, etc. */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Émetteur:</strong> {data?.emetteur}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{display:'flex', justifyContent: 'flex-end'}}>
                            <Typography variant="body1"><strong>Destinataire:</strong> {data?.destinataire || 'Non spécifié'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1"><strong>Référence:</strong> {data?.reference || 'Non spécifiée'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{display:'flex', justifyContent: 'flex-end'}}>
                            <Typography variant="body1"><strong>Date:</strong> {data?.date}</Typography>
                        </Grid>
                        {(data?.format !== null ? 
                            <Grid item xs={12} sm={6} sx={{display:'flex', justifyContent: 'flex-start'}}>
                            <Typography variant="body1"><strong>Format:</strong> {data?.format}</Typography>
                             </Grid>
                            : <Grid item xs={12} sm={6} sx={{display:'flex', justifyContent: 'flex-start'}}>
                            <Typography variant="body1"><strong>Format: Non definit</strong> {data?.format}</Typography>
                            </Grid>)

                        }
                    </Grid>
                </Box>
                {/* Tableau des désignations */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Désignation</strong></TableCell>
                                <TableCell><strong>Quantité</strong></TableCell>
                                <TableCell><strong>Prix Unitaire (CFA)</strong></TableCell>
                                <TableCell><strong>Montant</strong></TableCell>
                                <TableCell><strong>Devise</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.designations.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.designation}</TableCell>
                                    <TableCell>{item.volume_ambiant}</TableCell>
                                    <TableCell>{item.prixUnitaire}</TableCell>
                                    <TableCell>{item.montant}</TableCell>
                                    <TableCell>{item.devise}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Montants en bas à droite */}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2} flexDirection='column' alignItems='center'>
                    <Typography variant="body1"><strong>Montant HT:</strong> {data?.montantHT}CFA</Typography>
                    <Typography variant="body1"><strong>Montant TVA:</strong> {data?.montantTVA.toFixed(2)}CFA</Typography>
                    <Typography variant="body1"><strong>Montant TTC:</strong> {data?.montantTTC.toFixed(2)}CFA</Typography>
                </Box>
            </CardContent>
        
        </Card>
    );
};

export default observer(DetailFacture);
