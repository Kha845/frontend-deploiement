import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Snackbar, Alert, IconButton, InputAdornment  } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { format , isWithinInterval, parseISO} from 'date-fns'; // Librairie pour formater les dates
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Search } from '@mui/icons-material';


interface RowDataType {
    id: number;
    date: string;
    Gazoil: number;
    Diesel: number;
    Super: number;
    emetteur: string;
    UniteDeMesure: string,
}
const DetailsEntrantCommercialMois = () => {
  const { rootStore: { senStockStore } } = useStore();
  const [rows, setRows] =  useState<RowDataType[]>([]); ; // State pour stocker les données transformées
  const [totals, setTotals] = useState<{
    Gazoil: number;
    Diesel: number;
    Super: number;
  }>({
    Gazoil: 0,
    Diesel: 0,
    Super: 0
  });
  const [month, setMonth] = useState(''); // Stocker le mois actuel
  const [filteredRows, setFilteredRows] = useState<RowDataType[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
    // États pour l'alerte
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const [fournisseur,setFournisseur] = useState('');
  // Fonction de conversion des unités en litres
    const convertToLitres = (value: number, unit: string): number => {
      switch (unit) {
        case 'hectolitre':
          return value * 100; // 1 hectolitre = 100 litres
        case 'metre cube':
          return value * 1000; // 1 mètre cube = 1000 litres
        case 'tonne':
          return value * 1000; // 1 tonne = 1000 litres
        default:
          return value; // Si l'unité est déjà en litres, on retourne la valeur telle quelle
      }
    };
    //fonction pour recalculer les quantites totaux
    const recalculateTotals = (data: any[]) => {
      const totalsByUnite = { Gazoil: 0, Diesel: 0, Super: 0 };
    
      data.forEach((row) => {
        totalsByUnite.Gazoil += row.Gazoil ? parseFloat(row.Gazoil) : 0;
        totalsByUnite.Diesel += row.Diesel ? parseFloat(row.Diesel) : 0;
        totalsByUnite.Super += row.Super ? parseFloat(row.Super) : 0;
      });
    
      setTotals(totalsByUnite); // Mettre à jour les totaux affichés
    };      

  // Fonction pour transformer et calculer les totaux
  const transformAndCalculateTotals = (data:any) => {
   // Initialiser les totaux comme des nombres (en litres)
      const totalsByUnite = {
        Gazoil: 0,
        Diesel: 0,
        Super: 0,
      };


    const transformedData = data.map((entry:any, index:any) => {
      const designations = JSON.parse(entry.designations);

      const row = {
        id: index, // Identifiant unique pour chaque ligne
        date: entry.date,
        Gazoil: 0,
        Diesel: 0,
        Super: 0,
        emetteur: entry.emetteur,
        UniteDeMesure: entry.UniteDeMesure,
      };

      designations.forEach((item:any) => {
          // Regroupement des quantités par désignation et unité de mesure
          const unite = entry.UniteDeMesure;
          const quantityInLitres = convertToLitres(item.quantite, unite); // Conversion en litres
        if (item.designation === "Gazoil") {
          row.Gazoil = quantityInLitres ;
          totalsByUnite.Gazoil += quantityInLitres;
        } else if (item.designation === "Diesel") {
          row.Diesel = quantityInLitres ;
          totalsByUnite.Diesel += quantityInLitres;
        } else if (item.designation === "Super") {
          row.Super = quantityInLitres ;
          totalsByUnite.Super += quantityInLitres;
        }
      });

      return row;
    });

    setTotals(totalsByUnite);
    return transformedData;
  };

  const initTable = async () => {
    try {
      // Récupérer toutes les données des mois précédents
      const data = await senStockStore.getDataLastMonthInputStockCommercial();
      const transformedData = transformAndCalculateTotals(data);
      
      // Set les données transformées
      setRows(transformedData);
  
      // Filtrer pour afficher seulement les enregistrements du mois précédent
      const previousMonthData = transformedData.filter((item:any) => {
        const itemDate = new Date(item.date);
        const currentDate = new Date();
        const previousMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  
        // Comparer le mois et l'année de l'enregistrement avec le mois précédent
        return itemDate.getMonth() === previousMonth.getMonth() && itemDate.getFullYear() === previousMonth.getFullYear();
      });
  
      // Mettre à jour les rows filtrées
      setFilteredRows(previousMonthData);
      recalculateTotals(previousMonthData);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };
  // Fonction de recherche par intervalle de dates
  const handleFilterByDate = () => {
    if (!startDate || !endDate) {
      setAlertMessage("Veuillez sélectionner les deux dates !");
      setOpenAlert(true);
      return;
    }
  
    // Filtrer les données en fonction de l'intervalle de dates
    const filteredData = rows.filter((row) =>
      isWithinInterval(parseISO(row.date), {
        start: parseISO(startDate),
        end: parseISO(endDate),
      })
    );
  
    setFilteredRows(filteredData);
    recalculateTotals(filteredData);
  };
  
  useEffect(() => {
    initTable();
  }, []);
 // Fonction de recherche par fournisseur
 const handleFilterByFournisseur = () => {
  if (!fournisseur) {
    setAlertMessage("Veuillez entrer un nom de fourniseur !");
    setOpenAlert(true);
    return;
  }

  // Filtrer les données en fonction du nom de fournisseur
  const filteredData = rows.filter((row) =>
    row.emetteur.toLowerCase().includes(fournisseur.toLowerCase())
  );

// Mettre à jour les données filtrées
setFilteredRows(filteredData);
recalculateTotals(filteredData);
};

// Fonction de fermeture de l'alerte
const handleCloseAlert = () => {
  setOpenAlert(false);
};

// Fonction pour réinitialiser les filtres
const handleResetFilter = () => {
  setStartDate(null);
  setEndDate(null);
  setFournisseur(''); // Réinitialiser le champ de recherche par émetteur
  // Réinitialiser filteredRows en fonction des données par défaut (mois précédent ou toutes les données)
  const dataToShow = rows.filter((row) => {
    const itemDate = new Date(row.date);
    const currentDate = new Date();
    const previousMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    // Filtrer par mois précédent si les filtres sont réinitialisés
    return itemDate.getMonth() === previousMonth.getMonth() && itemDate.getFullYear() === previousMonth.getFullYear();
  });

  setFilteredRows(dataToShow); // Remettre les données filtrées par défaut
  recalculateTotals(dataToShow); // Recalculer les totaux pour les données filtrées
};
useEffect(() => {
  initTable();
}, []);
    // Mettre à jour la date dès que filteredRows change
  useEffect(() => {
    if (filteredRows.length > 0) {
      const date = new Date(filteredRows[0].date);  // Récupérer la date du premier élément filtré
      setMonth(format(date, 'MMMM yyyy'));  // Mettre à jour l'affichage du mois
    }
  }, [filteredRows]);  // Ce useEffect sera déclenché chaque fois que filteredRows change
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginLeft: '10px',
        marginTop: '0px',
      }}
    >
        <Box display="flex" justifyContent='left' alignItems="center" width='100%'>
            <IconButton sx={{ mt: 2, ml: 2, background: 'green' }} onClick={() => { navigate(-1); }}>
                <ArrowBack sx={{color: 'white' }}/>
            </IconButton>
        </Box>

      <Typography variant="h4" textAlign="center" gutterBottom color="success" marginLeft='11.5%'>
      TABLEAU DES ENTREES DE CARBURANTS EN FORMAT COMMERCIAL DE SENSTOCK POUR LE MOIS {month}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginTop: 2,
          justifyContent: 'center',
          alignItems: 'left',
          width: '100%',
          marginBottom: '20px'
        }}
      >
        <TextField
          label="Date de début"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate || ''}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Date de fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate || ''}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="success" onClick={handleFilterByDate}>
          Rechercher
        </Button>
        <TextField 
              variant="outlined"
              placeholder="Rechercher..."
              value={fournisseur}
              onChange={(e) => setFournisseur(e.target.value)}
                      sx={{ width: '230px', marginRight: 1,'& .MuiOutlinedInput-root': {
                            height: '35px',  // Ajustez la hauteur totale ici
                            fontSize: '0.875rem', // Optionnel : ajuster la taille du texte pour correspondre
                        },}}
                      InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          <Button  variant="contained" color='success' onClick={handleFilterByFournisseur}>Rechercher par fournisseur</Button>
          <Button variant="contained" color="success" onClick={handleResetFilter}>
          Afficher tout
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1400px',
          marginLeft: '130px',
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dates</TableCell>
                <TableCell align="right">Gazoil </TableCell>
                <TableCell align="right">Diesel </TableCell>
                <TableCell align="right">Super </TableCell>
                <TableCell align="right">Fournisseurs</TableCell>
                <TableCell align="right">Unite de Mesure</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="right">{row.Gazoil}</TableCell>
                  <TableCell align="right">{row.Diesel}</TableCell>
                  <TableCell align="right">{row.Super}</TableCell>
                  <TableCell align="right">{row.emetteur}</TableCell>
                  <TableCell align="right">{row.UniteDeMesure}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
        <Box sx={{ marginTop: 2, textAlign: 'center', width: '100%' }}>
        <Typography variant="h6">
        {startDate && endDate ? (
          <>Quantité totale du {format(parseISO(startDate), 'dd/MM/yyyy')} au {format(parseISO(endDate), 'dd/MM/yyyy')} :</>
        ) : (
          <>Quantité totale pour le mois précédent : {month}</>
        )}
      </Typography>
        <Box>
          <Typography variant="body1">
            Gazoil : {totals.Gazoil} | Litres
          </Typography>
          <Typography variant="body1">
            Diesel : {totals.Diesel} | Litres
          </Typography>
          <Typography variant="body1">
            Super : {totals.Super} | Litres
          </Typography>
        </Box>
      </Box>
        {/* Composant Snackbar pour l'alerte */}
        <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseAlert} severity="warning" 
        sx={{ width: '100%', marginTop:'50%' }} >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetailsEntrantCommercialMois;
