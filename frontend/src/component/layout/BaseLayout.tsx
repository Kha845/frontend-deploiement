/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import {AppBar,Toolbar,Tabs,Tab,Menu,MenuItem,Grid,Typography, Button, 
  Container, IconButton, Box, Divider, List, ListItem, ListItemButton, ListItemText,Drawer} from '@mui/material';
import tabs from '../../config/tab';
import subMenus from '../../config/subMenu';
import { Login } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/rootStore';
import AppDialog from '../AppDialog/appDialog';
import MenuIcon from '@mui/icons-material/Menu';
import AppAlert from '../Alert/AppAlert';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window ; // Permet à `window` d'être de type `Window` ou `any`
}
const drawerWidth = 240;
const BaseLayout: React.FC<Props> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTabIndex, setCurrentTabIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{prenom:string, nom:string,roles: string[]} | null>(null);
  const container = window !== undefined ? () => window().document.body : undefined;
  const { rootStore: { authStore , dialogStore,alertStore} } = useStore();
  
  // Fonction pour gérer le clic sur un onglet
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, newIndex: number) => {
    console.log('Onglet sélectionné:', tabs[newIndex].label); 
    setCurrentTabIndex(newIndex);
    setAnchorEl(event.currentTarget);
  };

  // Fermeture du sous-menu
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentTabIndex(null);
  };

  // Gestion de la redirection lors du clic sur un élément du sous-menu
  const handleSubMenuClick = (path: string) => {
    navigate(path);
    handleClose();
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
        const userData = authStore.getUserInfo(); // Récupérer les infos de l'utilisateur
        setUserInfo(userData); // Stocker les infos localement dans le state
      };
    fetchUserInfo();
}, []);
// Fonction de bascule pour ouvrir/fermer le Drawer
const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
  if (mobileOpen) {
    handleClose();
  }
};
const logout = async () =>{
          try {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const resData = await authStore.logout();
              console.log('Les donnees de deconnexion',resData);
          } catch (error) {
              console.log(error)
          }
      }
  // Filtrer les onglets principaux en fonction du rôle de l'utilisateur
  const filteredTabs = tabs.filter((tab) => {
    
    if (userInfo?.roles?.includes('DGA')) {
      return ['Accueil', 'Tableau de bord', 'Stock', 'Clients', 'Transaction', 'Réseau d\'approvisionnement'].includes(tab.label);
    } else if (userInfo?.roles?.includes('Admin')) {
      return ['Accueil', 'Tableau de bord', 'Stock', 'Clients', 'Réseau d\'approvisionnement'].includes(tab.label);
    } else if (userInfo?.roles?.includes('Chef Comptable')) {
      return ['Accueil', 'Tableau de bord', 'Transaction', 'Réseau d\'approvisionnement'].includes(tab.label);
    } else if (userInfo?.roles?.includes('Agent Comptable')) {
      return ['Accueil', 'Transaction'].includes(tab.label);
    } else if (userInfo?.roles?.includes('Gérant station')) {
         return ['Accueil','Tableau de bord','Transaction'].includes(tab.label);
    }
    return false;
  });
  // Fonction pour filtrer les sous-menus en fonction du rôle et de l'onglet sélectionné
  const filteredSubMenus = () => {
    if (currentTabIndex !== null) {
      const currentTabLabel = filteredTabs[currentTabIndex]?.label; // Utilise les onglets filtrés pour éviter les décalages
      const availableSubMenus = subMenus[currentTabLabel as keyof typeof subMenus] || [];
      console.log('Sous-menus disponibles pour', currentTabLabel, ':', availableSubMenus);

      // Appliquer le filtrage selon le rôle de l'utilisateur
      if (currentTabLabel === 'Transaction') {
        if (userInfo?.roles?.includes('Chef Comptable') || userInfo?.roles?.includes('DGA')) {
          return availableSubMenus;

        } else if (userInfo?.roles?.includes('Gérant station')) {

          return availableSubMenus.filter((subMenu: any) =>
            ['Bon de commande', 'Mode de Paiement'].includes(subMenu.label)
          );
        } else if (userInfo?.roles?.includes('Agent Comptable')) {
          return availableSubMenus.filter((subMenu: any) =>
            ['Bon de livraison', 'Facture'].includes(subMenu.label)
          );
        }
      }
      if (currentTabLabel === 'Tableau de bord') {
        if (userInfo?.roles?.includes('DGA') || userInfo?.roles?.includes('Admin')
           || userInfo?.roles?.includes('Chef Comptable')) {
          return availableSubMenus;
        }else if (userInfo?.roles?.includes('Gérant station')) {
          return availableSubMenus.filter((subMenu: any) =>
            ['RECAPILATIF'].includes(subMenu.label)
          );
        }
      }
      if (currentTabLabel === 'Stock') {
        if (userInfo?.roles?.includes('DGA') || userInfo?.roles?.includes('Admin')) {
          return availableSubMenus;
        }
      }
      if (currentTabLabel === 'Clients') {
        if (userInfo?.roles?.includes('DGA') || userInfo?.roles?.includes('Admin')) {
          return availableSubMenus;
        }
      }
      if (currentTabLabel === "Réseau d'approvisionnement") {
        if (userInfo?.roles?.includes('DGA') || userInfo?.roles?.includes('Admin')) {
          return availableSubMenus;
        }else if (userInfo?.roles?.includes('Chef Comptable')) {
          return availableSubMenus.filter((subMenu: any) =>
            ['Fournisseurs'].includes(subMenu.label)
          );
        }
      }else if (currentTabLabel === "Accueil") {
        return availableSubMenus;
      }

      return [];
    }
    return [];
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>KHABANE</Typography>
      <Divider />
      <List>
        {filteredTabs.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => { 
              navigate(item.path); 
              handleDrawerToggle(); // Fermeture automatique après sélection
            }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={() => { 
            logout();
            handleDrawerToggle(); // Fermeture automatique après déconnexion
          }}>
            <ListItemText primary="Déconnexion" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <Container maxWidth="xl"  style={{ padding: '20px' , marginTop: '70px', }}>
     <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1201 }}>
          <MenuIcon />
      </IconButton>
      <AppBar position="fixed" sx={{ backgroundColor: 'green', width: '100%',
         paddingX: { xs: 2, sm: 3, md: 4 }, display: { xs: 'none', sm: 'none', md: 'block' },}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: { xs: '56px', sm: '64px' }}}>
          <img
            src='/images/logo.png'
            alt="Logo"
            style={{
              width: '40px',
              height: '40px',
              marginRight: '20px',
              borderRadius: '50%',
              objectFit: 'cover',
              backgroundColor: 'white',
            }}
          />
          <Tabs
            value={currentTabIndex ?? false} // Évite la sélection d'un index erroné
            sx={{ flexGrow: 1, '& .MuiTab-root': { color: 'white' }, marginLeft: 2 }}
          >
            {filteredTabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                onClick={(event) => handleMenuClick(event, index)}
                sx={{
                  '&:hover': { backgroundColor: '#FFD000' },
                  minWidth: 120,
                }}
              />
            ))}
          </Tabs>
          <Button
              sx={{
                color: 'red',
                height: '48px',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                padding: '0 16px', // Marges internes
                whiteSpace: 'nowrap' // Empêche le texte de se mettre à la ligne
              }}
              onClick={logout}
            >
          <Typography>
            <Login />
            Déconnexion
          </Typography>
        </Button>
        </Toolbar>
      </AppBar>
          <Drawer
            container={container} // Assure que le Drawer s'attache à l'élément spécifié
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '100%',
            backgroundColor: 'white',
            marginTop: '0px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            margin: '10',
          },
        }}
      >
        {currentTabIndex !== null && (
          <Grid container sx={{ padding: '0px', display: 'flex', justifyContent: 'center', alignItems:'left' }}>
            {filteredSubMenus()?.map((subMenu: any, index: any) => (
              <Grid
                item
                key={index}
                sm={filteredTabs[currentTabIndex]?.label === 'Stock'  ? 6 : 3} // Ajustement de la grille
                sx={{ textAlign: 'center' }}
              >
                <MenuItem
                   disableRipple
                   disableTouchRipple
                  onClick={() => handleSubMenuClick(subMenu.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 20px',
                    width: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent', // Supprimer la couleur de hover
                    },
                  
                  }}
                >
                  <Button 
                  sx={
                    filteredTabs[currentTabIndex]?.label === 'Stock'
                      ? { marginLeft: 30, color: 'green', fontSize: '0.1rem' } // Réduction de la taille
                      : { marginLeft: 10, color: 'green', fontSize: '0.1rem' }
                  }>
                    {subMenu.icon}
                  </Button>
                  <Typography sx={{ color: 'green' }}>{subMenu.label}</Typography>
                </MenuItem>
              </Grid>
            ))}
          </Grid>
        )}
      </Menu>
       <Container  > {/* Réduisez ici la marge pour rapprocher le contenu */}
      
      </Container>
      {alertStore.isAlertOpen &&
          <AppAlert />}
      <Outlet />
        {dialogStore.isDialogOpen && <AppDialog  />}
       
  </Container>
  );
};

export default observer(BaseLayout);
