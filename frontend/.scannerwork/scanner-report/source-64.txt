/* eslint-disable react-refresh/only-export-components */
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStore } from '../../../../store/rootStore';
import { useNavigate} from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

// Définir les types des données
interface Designation {
  designation: string;
  quantite: number;
//   prixUnitaire: number;
//   montant: number;
//   devise: string;
}

interface FactureData {
//   [x: string]: any;
//   emetteur: string;
//   destinataire: string | null;
  reference: string | null;
  date: string;
//   format: string;
  designations: Designation[];
//   montantHT: number;
//   montantTVA: number;
//   montantTTC: number;
}

const FacturePayee = () => {
    const { rootStore: { recapilatifStore} } = useStore();
//   const [dataFacturePayee, setdataFacturePayee] = useState<FactureData | null>(null);
  const [dataFacturePayee, setdataFacturePayee] = useState<FactureData[]>([]);
  const [filteredFactures, setFilteredFactures] = useState<FactureData[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
    const navigate = useNavigate();
    const { getDataFacturePaye}=  recapilatifStore;
    const facturePaye = async () => {
        try {
          const resData = await getDataFacturePaye();
    
          if (!resData) {
            console.error("Aucune donnée n'a été renvoyée par getDataFacturePaye");
            return;
          }
          setdataFacturePayee(resData.details_facture);
          setFilteredFactures(resData.details_facture); // Initialiser les factures filtrées
          console.log('la liste des factures payees', resData.details_facture)
          console.log("Les factures payees:", resData);
    
        } catch (error) {
          console.log("Erreur de téléchargement des données", error);
        }
      };
    useEffect(() => {
       facturePaye();
    },[]);

    const handleFilter = () => {
        if (!startDate || !endDate) {
          setFilteredFactures(dataFacturePayee); // Réinitialiser le filtre si une date est manquante
          return;
        }
    
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
    
        const filtered = dataFacturePayee.filter((facture) => {
          const factureDate = new Date(facture.date).getTime();
          return factureDate >= start && factureDate <= end;
        });
    
        setFilteredFactures(filtered);
      }
      const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setFilteredFactures(dataFacturePayee); // Réinitialiser le tableau à l'état initial
      };
    // Vérifier si les données sont disponibles avant de les afficher
    if (!dataFacturePayee) {
        return <Typography color='primary' textAlign='center'>Chargement...</Typography>; // Retourner un message ou un loader pendant le chargement des données
    }

    return (
    <Card sx={{ marginLeft: '98px', marginTop: 2, width: '160%' }}>
         <Box display="flex" justifyContent='left' alignItems="center" width='100%'>
            <IconButton sx={{ mt: 2, ml: 2, background: 'green' }} onClick={() => { navigate(-1); }}>
                <ArrowBack sx={{color: 'white' }}/>
            </IconButton>
        </Box>
      <CardContent>
        <Typography variant="h4" gutterBottom color="success" textAlign="center">
          Liste des Factures Payées
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <TextField
            type="date"
            label="Date de début"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ marginRight: 2 }}
          />
          <TextField
            type="date"
            label="Date de fin"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ marginRight: 2 }}
          />
         <Box sx={{display:'flex',gap:2}}>
            <Button variant="contained" color="success" onClick={handleFilter}>
                    Recherche
            </Button>
            <Button variant="outlined" color="success" onClick={handleReset}
                >
                Tout
            </Button>
         </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Référence</strong></TableCell>
                <TableCell><strong>Gazoil</strong></TableCell>
                <TableCell><strong>Super</strong></TableCell>
                <TableCell><strong>Diesel</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFactures.map((facture:any) => {
                 let designations = [];

                 // Vérifier et convertir `designations` si nécessaire
                 if (typeof facture.designations === 'string') {
                   try {
                     designations = JSON.parse(facture.designations); // Convertir la chaîne JSON en tableau
                   } catch (e) {
                     console.error("Erreur lors de l'analyse JSON de `designations` :", e);
                     designations = [];
                   }
                 } else if (Array.isArray(facture.designations)) {
                   designations = facture.designations; // Déjà un tableau
                 }
                // console.log('la liste des designations',facture.designations)
                const gazoil = designations.find((d:any) => d?.designation === 'Gazoil') || { quantite: 0, montant: 0 };
                const superFuel = designations.find((d:any) => d?.designation === 'Super') || { quantite: 0, montant: 0 };
                const diesel = designations.find((d:any) => d?.designation === 'Diesel') || { quantite: 0, montant: 0 };

                return (
                  <TableRow key={facture.id}>
                    <TableCell>{facture.reference || 'Non spécifiée'}</TableCell>
                    <TableCell>
                      Quantité: {gazoil.quantite}<br />
                      Montant: {gazoil.montant} CFA
                    </TableCell>
                    <TableCell>
                      Quantité: {superFuel.quantite}<br />
                      Montant: {superFuel.montant} CFA
                    </TableCell>
                    <TableCell>
                      Quantité: {diesel.quantite}<br />
                      Montant: {diesel.montant} CFA
                    </TableCell>
                    <TableCell>{new Date(facture.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
    );
};

export default observer(FacturePayee);
