import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, TextField, InputAdornment, MenuItem, Menu, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../store/rootStore';
import SearchIcon from '@mui/icons-material/Search';
// Définition de l'interface pour les lignes
interface FactureRow {
  id: number;
  reference: string;
 
}
const paginationModel = { page: 0, pageSize: 5 };

const FactureList = () => {
  const { rootStore: { factureStore } } = useStore();
  const [searchValue, setSearchValue] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data,setData] = React.useState<FactureRow | null>(null);
    // Fonction pour ouvrir le menu
    const handleClick = (event:any) => {
        setAnchorEl(event.currentTarget);
    };

    // Fonction pour fermer le menu
    const handleClose = () => {
        setAnchorEl(null);
    };

  const initTable = async () => {
    try {
      const resData = await  factureStore.facture_rejetees();
      setData(resData)
      console.log('les factures rejetees', resData)
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
  const filteredRows: FactureRow[] = (factureStore.rowData as unknown as FactureRow[]).filter((row) => {
    if (!searchValue) return true;
    return row.reference.toLowerCase().includes(searchValue.toLowerCase())       
  });
  return (
    <Box sx={{paddingRight: '0px', marginLeft:'90px'}}>
        <Box display="flex" justifyContent="center" marginBottom={2} alignItems="center">
            <Typography variant='h4' className='text-center' color='success'>
            La liste des factures rejetées par le chef comptable
            </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
          {/* <Button variant="contained" component={Link} to={'create'} color='success'>
            Nouvelle facture
          </Button> */}
          <Box>
             {/* Bouton pour ouvrir le menu */}
             <Button variant="contained" color="success" onClick={handleClick}>
                Enregistrer facture
            </Button>

            {/* Menu déroulant avec les options */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {/* Option pour Enregistrement facture fournisseur */}
                <MenuItem component={Link} to="enregistrement-fournisseur" onClick={handleClose}>
                    Enregistrement facture fournisseur
                </MenuItem>

                {/* Option pour Enregistrement facture stockeur */}
                <MenuItem component={Link} to="enregistrement-stockeur" onClick={handleClose}>
                    Enregistrement facture stockeur
                </MenuItem>

                {/* Option pour Enregistrement autre */}
                <MenuItem component={Link} to="enregistrement-autre" onClick={handleClose}>
                    Enregistrement facture autre
                </MenuItem>
            </Menu>
          </Box>
          {/* <Button variant="contained" component={Link} to={'save'} color='success'>
            Enregistrer facture
          </Button> */}
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
        <Paper sx={{ height: 450, width: '110%',}}>
          <DataGrid
            rows={filteredRows.sort((a, b) => b.id - a.id)}
            columns={factureStore.columnsEnvoieFacture}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.id} 
            sx={{ border: 0, width: '100%' }}
          />
        </Paper>
    </Box>
  );
};

export default observer(FactureList);
