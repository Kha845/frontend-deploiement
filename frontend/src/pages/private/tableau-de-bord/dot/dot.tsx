import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, CardActions, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';

interface Designation {
  designation: string;
  quantite: number;
  volume_a_15_kg: string;
  prixUnitaire?: number;
  montant?: number;
}
interface FactureData {
  emetteur: string;
  destinataire: string | null;
  reference: string | null;
  date: string;
  format: string;
  UniteDeMesure: string;
  designations: Designation[];
}
interface BonDeLivraison{
  dateLivraison: string;
  designations: Designation[];
  UniteDeMesure: string;
}
const StockDOT = () => {
  const { rootStore: { dotStore} } = useStore();
  const [data, setData] = useState<FactureData | null>(null);
  const [dataCommercial, setDataComercial] = useState<FactureData | null>(null);
  const [dataSortie,setDataSortie] = useState<BonDeLivraison | null>(null);
  const [lastEntree, setLastEntree] = useState<{
    date: any;
    format: any;
    quantiteGazoil: any;
    quantiteSuper: any;
    quantiteDiesel: any;
    temperature: any;
    uniteDeMesure: any;
    [key: string]: any;
} | null>(null);
const [lastSortie, setLastSortie] = useState<{
  date: any;
  quantiteGazoil: any;
  quantiteSuper: any;
  quantiteDiesel: any;
  uniteDeMesure: any;
  [key: string]: any;
} | null>(null);
const [lastInitiale, setLastInitiale] = useState<{
  date: any;
  quantiteGazoil: any;
  quantiteSuper: any;
  quantiteDiesel: any;
  temperature: any;
  uniteDeMesure: any;
  [key: string]: any;
} | null>(null);
  useEffect(() => {
    const fetchLastRecord = async () => {
        const lastRecord = await dotStore.getDataLastRecord();
        console.log('Dernier enregistrement',lastRecord);
        if (lastRecord) {
            console.log("Derniers enregistrements :", lastRecord);
            // Utiliser les données ici, par exemple :
             setLastEntree(lastRecord.derniereEntree);
             setLastSortie(lastRecord.derniereSortie);
             setLastInitiale(lastRecord.derniereInitiale);
             console.log('les derniers donnees entree',lastEntree);
             console.log('les derniers donnees sortie',lastSortie);
             console.log('les derniers donnees initiale',lastInitiale);
        }
    };
    fetchLastRecord();
}, []);

  const { getDataLastInputStockIndustriel, getDataLastInputStockCommercial , getDataLastOutputStock}= dotStore;
  const detailsIndustriel = async () => {
    try {
      const resData = await getDataLastInputStockIndustriel();

      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par getDataLastInputStockIndustriel");
        return;
      }
      let parsedDesignations;
      if (typeof resData.data.designations === 'string') {
        try {
          // Première conversion pour gérer la chaîne double-échappée
          const firstParse = JSON.parse(resData.data.designations);  // Premier parsing
          console.log('Après premier parse:', firstParse);

          // Si nécessaire, un deuxième parse pour obtenir le tableau final
          if (typeof firstParse === 'string') {
            parsedDesignations = JSON.parse(firstParse);
          } else {
            parsedDesignations = firstParse;
          }

          console.log('Parsed designations:', parsedDesignations); // Résultat final
        } catch (e) {
          console.error("Erreur lors de la conversion JSON de 'designations':", e);
          parsedDesignations = [];
        }
      } else {
        parsedDesignations = resData.data.designations;
      }

      // Vérification de la structure du tableau
      if (!Array.isArray(parsedDesignations)) {
        console.error('Les designations ne sont pas sous forme de tableau:', parsedDesignations);
        parsedDesignations = [];  // Réinitialisation si ce n'est pas un tableau
      }

      // Créez un nouvel objet data avec designations correctement parsées
      const newData = {
        ...resData.data,
        designations: parsedDesignations,
      };

      setData(newData);
      console.log("État `data` après `setData`:", newData);

    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  const detailsCommercial = async () => {
    try {
      const resData = await getDataLastInputStockCommercial();
      
      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par getDataLastInputStockCommercial ");
        return;
      }
      let parsedDesignations;
      if (typeof resData.data.designations === 'string') {
        try {
          // Première conversion pour gérer la chaîne double-échappée
          const firstParse = JSON.parse(resData.data.designations);  // Premier parsing
          console.log('Après premier parse:', firstParse);

          // Si nécessaire, un deuxième parse pour obtenir le tableau final
          if (typeof firstParse === 'string') {
            parsedDesignations = JSON.parse(firstParse);
          } else {
            parsedDesignations = firstParse;
          }

          console.log('Parsed designations:', parsedDesignations); // Résultat final
        } catch (e) {
          console.error("Erreur lors de la conversion JSON de 'designations':", e);
          parsedDesignations = [];
        }
      } else {
        parsedDesignations = resData.data.designations;
      }

      // Vérification de la structure du tableau
      if (!Array.isArray(parsedDesignations)) {
        console.error('Les designations ne sont pas sous forme de tableau:', parsedDesignations);
        parsedDesignations = [];  // Réinitialisation si ce n'est pas un tableau
      }

      // Créez un nouvel objet data avec designations correctement parsées
      const newData = {
        ...resData.data,
        designations: parsedDesignations,
      };

      setDataComercial(newData);
      console.log("État `data` après `setData`:", newData);
    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  const detailsSortie = async () => {
    try {
      const resData = await getDataLastOutputStock();
      
      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par  getDataLastOutputStock ");
        return;
      }
      let parsedDesignations;
      if (typeof resData.data.designations === 'string') {
        try {
          // Première conversion pour gérer la chaîne double-échappée
          const firstParse = JSON.parse(resData.data.designations);  // Premier parsing
          console.log('Après premier parse:', firstParse);

          // Si nécessaire, un deuxième parse pour obtenir le tableau final
          if (typeof firstParse === 'string') {
            parsedDesignations = JSON.parse(firstParse);
          } else {
            parsedDesignations = firstParse;
          }

          console.log('Parsed designations:', parsedDesignations); // Résultat final
        } catch (e) {
          console.error("Erreur lors de la conversion JSON de 'designations':", e);
          parsedDesignations = [];
        }
      } else {
        parsedDesignations = resData.data.designations;
      }

      // Vérification de la structure du tableau
      if (!Array.isArray(parsedDesignations)) {
        console.error('Les designations ne sont pas sous forme de tableau:', parsedDesignations);
        parsedDesignations = [];  // Réinitialisation si ce n'est pas un tableau
      }

      // Créez un nouvel objet data avec designations correctement parsées
      const newData = {
        ...resData.data,
        designations: parsedDesignations,
      };

      setDataSortie(newData);
      console.log("État `data` après `setData`:", newData);
    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  useEffect(() => {
    detailsIndustriel();
    detailsCommercial();
    detailsSortie();
  }, []);

  if (!data) {
    return <Box textAlign='center' mt={5}><CircularProgress /></Box>;
  }
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      marginTop: '0px',
    }}
>
  <Typography variant="h4" textAlign="center" gutterBottom color="success">
    ENTREE STOCK
  </Typography>
  
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '1200px',
    }}
  >
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center',padding:'5px' }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'green', color: 'green' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div" gutterBottom textAlign="center" sx={{ marginBottom: 3 }}>
            Format Industriel
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Date: {data.date}</Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Stockeur: DOT</Typography>
         </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Désignation</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantité ({data.UniteDeMesure})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(data.designations) &&
                    data.designations.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.designation}</TableCell>
                        <TableCell>{item.volume_a_15_kg}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" color="success" sx={{ paddingX: 4, paddingY: 1.5 }}  component={Link} to={'detailsInputStockIndustrielForMonth'}>
            Détails
          </Button>
        </CardActions>
      </Card>
    </Box>
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center',padding:'5px' }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'green', color: 'green' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div" gutterBottom textAlign="center" sx={{ marginBottom: 3 }}>
            Format Commercial
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Date: {dataCommercial?.date}</Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Stockeur: DOT</Typography>
            </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Désignation</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantité ({data.UniteDeMesure})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(dataCommercial?.designations) &&
                    dataCommercial?.designations.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.designation}</TableCell>
                        <TableCell>{item.volume_a_15_kg}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" color="success" sx={{ paddingX: 4, paddingY: 1.5 }} component={Link} to={'detailsInputStockCommercialForMonth'}>
            Détails
          </Button>
        </CardActions>
      </Card>
    </Box>
  </Box>
   {/* Nouvelle ligne de cartes */}
   <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '1200px',
      marginTop: 4,
    }}
  >
    {/* Nouvelle carte 1 */}
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center',padding:'5px'  }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'white', color: 'white' , background:'green'}}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div" gutterBottom textAlign="center" sx={{ marginBottom: 3 }}>
            SORTIE STOCK
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Date: {dataSortie?.dateLivraison}</Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Stockeur: DOT</Typography>
            </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Désignation</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantité ({dataSortie?.UniteDeMesure})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(data.designations) &&
                    dataSortie?.designations.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.designation}</TableCell>
                        <TableCell>{item.quantite}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" sx={{ paddingX: 4, paddingY: 1.5,
             backgroundColor: 'white', color: 'green'}} component={Link} to={'detailsOutPutStockForMonth'}>
            Details
          </Button>
        </CardActions>
      </Card>
    </Box>

    {/* Nouvelle carte 2 */}
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center' ,padding:'5px' }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'white',backgroundColor:'green', color: 'white' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div" gutterBottom textAlign="center" sx={{ marginBottom: 3 }}>
            ETAT STOCK
          </Typography>
        <TableContainer component={Paper}>
        <Table sx={{ width: '100%'}}>
            <TableHead>
                <TableRow>
                    <TableCell><strong>Désignation</strong></TableCell>
                    <TableCell align="center"><strong>Dernière Entrée </strong></TableCell>
                    <TableCell align="center"><strong>Dernière Sortie </strong></TableCell>
                    <TableCell align="center"><strong>Stock Initiale </strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {["Gazoil", "Super", "Diesel"].map((designation: string) => {

                    const dernieresEntree = lastEntree ? lastEntree[`quantite${designation}`] : 0;
                    const derniereSortie = lastSortie? lastSortie[`quantite${designation}`] : 0;
                    const derniereInitial = lastInitiale? lastInitiale[`quantite${designation}`] : 0;
                     // Accédez à l'unite de mesure de chaque type de carburant (uniquement la date pour entrée et sortie)
                    const uniteDeMesureEntree = lastEntree ? lastEntree.uniteDeMesure : "-";
                    const uniteDeMesuredateSortie = lastSortie ? lastSortie.uniteDeMesure : "-";
                    const uniteDeMesuredateInitiale =  lastInitiale ?  lastInitiale.uniteDeMesure : "-";
                    return (
                        <TableRow key={designation}>
                            <TableCell>{designation}</TableCell>
                            <TableCell align="center">{dernieresEntree}({uniteDeMesureEntree})</TableCell>
                            <TableCell align="center">{derniereSortie}({uniteDeMesuredateSortie })</TableCell>
                            <TableCell align="center">{derniereInitial}({uniteDeMesuredateInitiale})</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" color="success"
           sx={{ paddingX: 4, paddingY: 1.5,backgroundColor: 'white',
            color: 'green' }} component={Link} to={'detailsStock'}>
            Details
          </Button>
        </CardActions>
      </Card>
    </Box>
    </Box>
  </Box>
  );
};

export default StockDOT;
