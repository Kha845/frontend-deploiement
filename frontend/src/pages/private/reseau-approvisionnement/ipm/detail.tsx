/* eslint-disable react-refresh/only-export-components */
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { useNavigate, useParams } from 'react-router-dom';

interface IpmData {
  nb_agents: number;
  nb_de_mois: number;
  cotisation_adherant: number,
  cotisation_employeur: number,
  total_cotisations: number,
}

const DetailIpm = () => {
    const { rootStore: { ipmStore } } = useStore();
    const [data, setData] = useState<IpmData | null>(null); // Initialiser avec IpmData ou null
    const { getData } =  ipmStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const details = async () => {
        try {
            if (id) {
                const resData = await getData(id);
                console.log('Les donnees d\'un ipm',resData.data)
                setData(resData.data)
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
        return <Box textAlign='center' mt={5}><CircularProgress /></Box>;
      }
    return (
        <Card sx={{marginTop: 2, width: '100%' }}>
                <Box display='flex' justifyContent='start-end' alignItems='right'>
                <Button sx={{ mt: 2, ml: 2, background: 'gold', lg: '3' }} variant="contained" onClick={() => { navigate(-1); }}>
                            Retour
                </Button>
               </Box>
            <CardContent sx={{width: '100%'}}>
                <Typography variant="h4" gutterBottom color='success' textAlign='center'>
                    Détails d'ipm
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Nombre agents</strong></TableCell>
                                <TableCell><strong>Nombre de mois</strong></TableCell>
                                <TableCell><strong>Cotisation adherent</strong></TableCell>
                                <TableCell><strong>Cotisation Employeur</strong></TableCell>
                                <TableCell><strong>Cotisation total</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                <TableRow>
                                    <TableCell>{data.nb_agents}</TableCell>
                                    <TableCell>{data.nb_de_mois}</TableCell>
                                    <TableCell>{data.cotisation_adherant}</TableCell>
                                    <TableCell>{data.cotisation_employeur}</TableCell>
                                    <TableCell>{data.total_cotisations}</TableCell>
                                </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        
        </Card>
    );
};

export default observer(DetailIpm);
