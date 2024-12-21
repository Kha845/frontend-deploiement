/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';
import SearchIcon from '@mui/icons-material/Search';

// Définition de l'interface pour les lignes
interface FournisseurRow {
  id: number;
  nom: string;
}
const paginationModel = { page: 0, pageSize: 5 };

const FournisseurList = () => {
  const { rootStore: { fournisseurStore } } = useStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [data,setData] = React.useState<FournisseurRow | null>(null);

  const initTable = async () => {
    try {
     const resData =  await fournisseurStore.fournisseurLists();
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
    return <Box textAlign='center' mt={5}><CircularProgress /></Box>;
  }
  // Filtrer les données en fonction de la valeur de recherche
  const filteredRows: FournisseurRow[] = (fournisseurStore.rowData as unknown as FournisseurRow[]).filter((row) => {
    if (!searchValue) return true;
    return row.nom.toLowerCase().includes(searchValue.toLowerCase())
  });
  return (
    <Box>
      <Box>
      <Typography variant='h4' className='text-center' color='success'>
          La liste des fournisseurs
      </Typography>
      </Box>
        <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
          <Button variant="contained" component={Link} to={'create'} color='success'>
            Nouveau fournisseur
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
        <Paper sx={{ height: 500, width: '100%', display: {xs:2,sm:6} }}>
          <DataGrid
            rows={filteredRows.sort((a, b) => b.id - a.id)}
            columns={fournisseurStore.columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.id} // Spécifier quelle propriété utiliser comme identifiant
            sx={{ border: 0, width: '100%' }}
          />
        </Paper>
    </Box>
  );
};

export default observer(FournisseurList);
