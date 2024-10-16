import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import tabs from '../../config/tab';
import subMenus from '../../config/subMenu';
import { Login } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';

// Composant BaseLayout
const BaseLayout: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTabIndex, setCurrentTabIndex] = useState<number | null>(null);
  const navigate = useNavigate(); // Pour la navigation

  // Ouverture du menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, newIndex: number) => {
    setAnchorEl(event.currentTarget);
    setCurrentTabIndex(newIndex);
  };

  // Fermeture du sous-menu
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentTabIndex(null);
  };

  // Gestion de la redirection lors du clic sur un élément du sous-menu
  const handleSubMenuClick = (path: string) => {
    handleClose();
    navigate(path); // Redirige vers le chemin spécifié
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: 'green', width: '100%', paddingX: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tabs
            value={currentTabIndex}
            sx={{ flexGrow: 1, '& .MuiTab-root': { color: 'white' } }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                onClick={(event) => handleMenuClick(event, index)}
                sx={{
                  '&:hover': { backgroundColor: '#FFD000' }, // Couleur au survol
                  minWidth: 120,
                }}
              />
            ))}
          </Tabs>

          <IconButton sx={{ color: 'red' }}>
            {/* Bouton de déconnexion */}
            <Typography sx={{ marginRight: 2 }}>Déconnexion <Login /></Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sous-menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '100%', // Largeur égale à celle du Navbar
            backgroundColor: 'white', // Couleur de fond
            marginTop: '0px',
            display: 'flex', // Utiliser flex pour aligner horizontalement
            flexDirection: { xs: 'column', sm: 'row' },
            marginLeft: '10px',
            alignItems: 'center',
          },
        }}
      >
        {currentTabIndex !== null && (
          <Grid container sx={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
            {subMenus[tabs[currentTabIndex].label as keyof typeof subMenus]?.map((subMenu, index) => (
              <Grid
                item
                key={index}
                sm={tabs[currentTabIndex].label === 'Stock' ? 6 : 3} // Ajustement ici
                sx={{ textAlign: 'center' }}
              >
                <MenuItem
                  onClick={() => handleSubMenuClick(subMenu.path)} // Redirection lors du clic
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                >
                  <IconButton sx={{ marginRight: 2, color: 'green' }}> {/* Couleur verte pour l'icône */}
                    {subMenu.icon}
                  </IconButton>
                  <Typography sx={{ color: 'green' }}>{subMenu.label}</Typography> {/* Couleur verte pour le texte */}
                </MenuItem>
              </Grid>
            ))}
          </Grid>
        )}
      </Menu>

      {/* Contenu de la page */}
      <div style={{ paddingTop: '80px' }}>
        <Box component="main">
          <Toolbar />
          <Outlet />
        </Box>
      </div>
    </>
  );
};

export default BaseLayout;
