/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';
import SearchIcon from '@mui/icons-material/Search';
import DepotDialog from './depotDialog';

// Définition de l'interface pour les lignes
interface StockeurRow {
  idStokeur: number;
  nom: string;
}
interface StockeurData {
    idStokeur: number;
    nom: string;
    telephone: string;
    adresse: string;
    depots: { // Ajouter cette ligne
        id: number;
        nom: string;
        adresse: string;
      }[]; // Les depots d'un stockeur
}

const paginationModel = { page: 0, pageSize: 5 };

const StockeurList = () => {
  const { rootStore: {stockeurStore} } = useStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedDepots, setSelectedDepots] = React.useState([]);
  const [data,setData] = React.useState<StockeurData | null>(null);

  const initTable = async () => {
    try {
        const resData =  await stockeurStore.stockeursList();
       console.log('les donnees de stockeurs et ses depots ',resData);
       setData(resData);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };

  React.useEffect(() => {
    initTable();
  }, []);
  if (!data) {
    console.log('data:',data);
    return <Box textAlign='center' mt={5} marginLeft='790px'><CircularProgress /></Box>;
  }
  // Filtrer les données en fonction de la valeur de recherche
  const filteredRows: StockeurRow[] = (stockeurStore.rowData as unknown as StockeurRow[]).filter((row) => {
    if (!searchValue) return true;
    return row.nom.toLowerCase().includes(searchValue.toLowerCase())
  });
  const handleOpenDialog = (depots:any) => {
    setSelectedDepots(depots);
    setDialogOpen(true);
};

  return (
    <Box sx={{marginLeft: '300px'}}>
      <Box display="flex" justifyContent="center" marginBottom={2} alignItems="center">
            <Typography variant='h4' className='text-center' color='success'>
              La liste des stockeurs et leurs depots
            </Typography>
      </Box>
        <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
          <Button variant="contained" component={Link} to={'create'}
           color='success' sx={{marginRight: 20, width: '300px'}}>
            Nouveau Stockeur
          </Button>
          <Box display="flex" alignItems="center">
          <TextField 
              variant="outlined"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
                      sx={{ width: '500px', marginRight: 1,'& .MuiOutlinedInput-root': {
                            height: '35px',  // Ajustez la hauteur totale ici
                            fontSize: '0.875rem', // Optionnel : ajuster la taille du texte pour correspondre
                        },}}
                      InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Paper sx={{ height: 500, width: '100%' }}>
          <DataGrid
             rows={filteredRows.sort((a, b) => b.idStokeur - a.idStokeur)}
            columns={[
              {
                field: 'nom', // Colonne pour nom
                headerName: 'Nom',
                width: 150
              },
              {
                field: 'telephone', // Colonne pour telephone
                headerName: 'Telephone',
                width: 150
              },
              {
                field: 'depots', // Colonne pour les depots
                headerName: 'Depots',
                width: 250,
                renderCell: (params) => (
                  <Button color='success' onClick={() => handleOpenDialog(params.row.depots)}>
                    Voir Depots
                  </Button>
                )
              },
              // Ajoutez ensuite les autres colonnes qui ne sont pas mentionnées dans l'ordre spécifique
              ...stockeurStore.columns.filter(col => col.field !== 'nom' && col.field !== 'telephone' && col.field !== 'depots')
            ]}            
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.idStokeur} // Spécifier quelle propriété utiliser comme identifiant
            sx={{ border: 0, width: '100%' }}
          />
        </Paper>
        <DepotDialog
                    open={dialogOpen} 
                    onClose={() => setDialogOpen(false)} 
                    depots={selectedDepots} 
        />
    </Box>
  );
};

export default observer(StockeurList);
