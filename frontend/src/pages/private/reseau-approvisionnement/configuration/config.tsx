/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Box, Toolbar, Paper, Autocomplete, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { useStore } from '../../../../store/rootStore';
import { Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Typography as MuiTypography } from '@mui/material';
import { observer } from 'mobx-react-lite';
interface User {
  idUser: number;
  prenom: string;
  nom: string;
  roles: string[];
}
interface Role {
  id: number;
  nom_role: string;
}
const paginationModel = { page: 0, pageSize: 5 };

const Configuration: React.FC = () => {
  const { rootStore: { authStore, configStore } } = useStore();
 
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [dataRole,setDataRole] = useState<Role | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;
  const [errorMessage, setErrorMessage] = useState('');
  // État et fonctions pour la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToRevoke, setUserIdToRevoke] = useState<number | null>(null);
  const [roleToRevoke, setRoleToRevoke] = useState<string>('');

  const handleOpenDialog = (userId: number) => {
    setUserIdToRevoke(userId); // Nouveau state pour stocker l'ID utilisateur à révoquer
    setSelectedRoleIds(roles.map(role => role.id))
    setOpenDialog(true);
    setRoleToRevoke(''); // Réinitialise le rôle à révoquer
  }
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserIdToRevoke(null);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
    setRoleToRevoke(''); // Réinitialise le rôle à révoquer
  };
  const initTable = async () => {
    try {
      const resData = await configStore.roleLists();
      setDataRole(resData);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };
  // Récupération des utilisateurs et des rôles
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/listUserRoles`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        console.log('les donnees des utilisateurs', response.data);
        const usersData = response.data.data.users.map((user: any) => ({
          idUser: user.idUser, // Assure-toi d'avoir un ID unique
          prenom: user.prenom,
          nom: user.nom,
          roles: user.roles.map((role: any) => role.nom_role),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
        setAlertMessage('Erreur lors du chargement des utilisateurs.');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/roles/list`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        console.log('Roles recuperes', response.data.data);
        if (Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else {
          console.error('Les données des rôles ne sont pas au format tableau');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des rôles', error);
        setAlertMessage('Erreur lors du chargement des rôles.');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    };
    initTable();
    fetchUsers();
    fetchRoles();
  }, []);
  if (!dataRole) {
   
    return <Box textAlign='center' mt={5}><CircularProgress /></Box>;
  }
  // Création d'un nouveau rôle
  const handleCreateRole = async () => {
    if (newRoleName.trim() === '') {
      setErrorMessage('Le nom du rôle est requis');
      return;
    } else {
      setErrorMessage(''); // Réinitialiser le message d'erreur
    }
    try {
      // Envoi de la requête pour créer un rôle
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/roles/create`,
        { nom_role: newRoleName },
        {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true, // Assurez-vous que les cookies sont envoyés
        }
      );
  
      console.log('Réponse de l\'API:', response.data);
  
      const newRole = response.data.role; // Adaptez si nécessaire
      if (newRole?.id) {
        // Rafraîchir la liste des rôles après la création
        setRoles((prevRoles) => [...prevRoles, newRole]);
        const updatedRolesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/v1/roles/list`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
        setNewRoleName('');
        setAlertMessage('Rôle créé avec succès!');
        setAlertSeverity('success');
        setOpenAlert(true);
         // Mettez à jour l'état avec les nouveaux rôles
         setRoles(updatedRolesResponse.data.data);
      } else {
        console.warn("Le rôle créé n'a pas d'id :", newRole);
        setAlertMessage('Erreur : le rôle créé est invalide.');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du rôle', error);
      setAlertMessage(`Erreur lors de l'envoi des données : ${error.response?.data.message || 'Erreur inconnue'}`);
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };  
  // Attribution de plusieurs rôles à un utilisateur
  const handleAssignRoles = async () => {
    // Assurez-vous que l'utilisateur est sélectionné et que des rôles sont choisis
    if (!selectedUserId || selectedRoleIds.length === 0) {
      alert('Sélectionnez un utilisateur et au moins un rôle');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/v1/users/${selectedUserId}/assign-roles`,
        { role_ids: selectedRoleIds }, // Envoie un tableau de rôles
        {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );

      setAlertMessage('Rôles assignés avec succès');
      setAlertSeverity('success');
      // Réinitialisez les sélections
      setSelectedUserId('');
      setSelectedRoleIds([]); // Réinitialiser le tableau des rôles sélectionnés

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/listUserRoles`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      console.log('les donnees des utilisateurs', response.data);
      const usersData = response.data.data.users.map((user: any) => ({
        idUser: user.idUser, // Assure-toi d'avoir un ID unique
        prenom: user.prenom,
        nom: user.nom,
        roles: user.roles.map((role: any) => role.nom_role),
      }));
      setUsers(usersData)
      setOpenAlert(true);
    } catch (error) {
      console.error('Erreur lors de l\'assignation des rôles', error);
      setAlertMessage('Erreur lors de l\'assignation des rôles.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };
  // Mise à jour pour handleRevokeRole et handleRevokeRoles
  const handleRevokeRole = async (userId: number, role_name: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/v1/users/${userId}/revoke-role`,
        { nom_role: role_name },
        {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );

      setAlertMessage('Rôle révoqué avec succès');
      setAlertSeverity('success');
      setOpenAlert(true);

      // Récupérer la liste mise à jour
      await refreshUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la révocation du rôle:', error);
      setAlertMessage('Erreur lors de la révocation du rôle.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleRevokeRoles = async (userId: number, roleIds: number[]) => {
    try {
      const payload = { userId, roleIds };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/users/${userId}/revoke-roles`, payload, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      console.log('Réponse de l’API après révocation :', response.data);

      setAlertMessage('Tous les rôles ont été révoqués avec succès');
      setAlertSeverity('success');
      setOpenAlert(true);

      // Actualisez les utilisateurs pour refléter les changements
      const updatedUsersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/listUserRoles`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      // Vérifiez que les données récupérées sont valides
      if (updatedUsersResponse?.data.users) {
        setUsers(updatedUsersResponse.data.users);
      } else {
        console.error('Aucune donnée d\'utilisateur valide retournée.');
        setUsers([]); // Réinitialisez à un tableau vide si les données ne sont pas valides
      }

    } catch (error) {
      console.error('Erreur lors de la révocation des rôles', error);
      setAlertMessage('Erreur lors de la révocation des rôles.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleRevokeAllRoles = async () => {
    try {
      if (userIdToRevoke !== null && Array.isArray(roles)) {
        const allRoleIds = roles.map(role => role.id); // Extraction de tous les IDs

        // Assurez-vous que handleRevokeRoles gère les appels asynchrones
        await handleRevokeRoles(userIdToRevoke, allRoleIds); // Révoquer tous les rôles
        await refreshUsers();
        handleCloseDialog();
      } else {
        // Afficher un message d'erreur si l'utilisateur ou les rôles ne sont pas valides
        console.error('ID utilisateur ou rôles invalides');
        alert('Veuillez sélectionner un utilisateur et s\'assurer qu\'il a des rôles à révoquer.');
      }
    } catch (error) {
      console.error('Erreur lors de la révocation des rôles:', error);
      alert('Une erreur est survenue lors de la révocation des rôles. Veuillez réessayer.');
    }
  };

  // Fonction pour rafraîchir les utilisateurs
  const refreshUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/users/listUserRoles`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      const usersData = response.data.data.users.map((user: any) => ({
        idUser: user.idUser,
        prenom: user.prenom,
        nom: user.nom,
        roles: user.roles.map((role: any) => role.nom_role),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des utilisateurs', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: 'Utilisateur',
      width: 200,
      renderCell: (params: GridCellParams) => {
        if (!params?.row) {
          return 'Inconnu';
        }
        const prenom = params.row.prenom || '';
        const nom = params.row.nom || '';
        return `${prenom} ${nom}`;
      },
    },
    {
      field: 'roles',
      headerName: 'Rôle',
      width: 200,
      renderCell: (params) => {
        // params.row.roles devrait contenir un tableau de rôles
        const userRoles = params.row.roles; // Assurez-vous que les rôles sont dans chaque ligne
        if (!userRoles || userRoles.length === 0) {
          return 'Aucun rôle attribué'; // Affiche un message si l'utilisateur n'a pas de rôle
        }
        return userRoles.join(', ');
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params: GridCellParams) => {
        const hasRole = params.row.roles.length > 0;
        return (
          <>
            {hasRole && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOpenDialog(params.row.idUser)}
              >
                Révoquer
              </Button>
            )}
          </>
        );
      },
    }
  ];
  return (
    <Container>
      {/* Affichage des alertes */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
        width='100%'
        style={{ marginTop: '2%', paddingTop: '0px' }}
      >
        {/* Bloc pour les rôles et le formulaire d'assignation */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ marginLeft: 2 }}
          style={{marginBottom: '20px' }}
        >
          {/* Liste des rôles */}
          <Box style={{ width: '70%', marginRight: '20px', height: '500px' }}>
            <Paper sx={{ height: 400, width: '100%' }}>
              <Typography variant="h4" gutterBottom color='success' textAlign='center'>La liste des rôles</Typography>
              <DataGrid
                rows={configStore.rowData}
                columns={configStore.columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                getRowId={(row) => row.id} // Spécifier quelle propriété utiliser comme identifiant
                sx={{ border: 0, width: '100%' }}
              />
            </Paper>
          </Box>

          {/* Colonne pour les blocs de création et d'assignation de rôle */}
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            style={{ width: '50%', height: '500px' }}
            
          >
            <Typography variant="h4" gutterBottom color='success' textAlign='center'>Créer un rôle</Typography>
            <TextField
              label="Nom du rôle"
              variant="filled"
              value={newRoleName}
              required
              onChange={(e) => setNewRoleName(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <Button variant="contained" color='success' onClick={handleCreateRole}>Créer</Button>

            <Typography variant="h6" gutterBottom color='success' style={{ marginTop: '16px' }}>Assignation d'un rôle</Typography>
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="user-select-label">Sélectionner un utilisateur</InputLabel>
              <Select
                labelId="user-select-label"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                label="Sélectionner un utilisateur"
              >
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user.idUser} value={user.idUser}>{`${user.prenom} ${user.nom}`}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Aucun utilisateur disponible</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="role-select-label">Sélectionner des rôles</InputLabel>
              <Select
                labelId="role-select-label"
                multiple // Permet la sélection multiple
                value={selectedRoleIds} // Doit être un tableau
                onChange={(e) => {
                  const value = e.target.value as number[]; // Cast la valeur à un tableau de nombres
                  setSelectedRoleIds(value); // Met à jour l'état avec les rôles sélectionnés
                }}
                renderValue={(selected) =>
                  selected.map((id) => roles.find(role => role.id === id)?.nom_role).join(', ') // Affiche les noms des rôles sélectionnés
                }
                label="Sélectionner des rôles"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.nom_role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color='success' onClick={handleAssignRoles}>Assigner Rôle</Button>
          </Box>
        </Box>

        {/* Bloc DataGrid pour afficher les utilisateurs et leurs rôles */}
        <Box>
          <Typography variant="h4" gutterBottom color='success' textAlign='center'>La liste des utilisateurs et leurs rôles</Typography>
          <div>
            {users.length > 0 ? (
              <DataGrid
                rows={users}
                columns={columns}
                pagination
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 25]}
                getRowId={(row) => row.idUser}
              />
            ) : (
              <div>Chargement des utilisateurs...</div>
            )}
          </div>
        </Box>
        {/* Boîte de dialogue pour la révocation de rôles */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Révocation de rôle</DialogTitle>
          <Box sx={{ padding: 2 }}>
            {/* Bouton pour révoquer tous les rôles */}
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleRevokeAllRoles();
                console.log('Les roles ids', selectedRoleIds)
              }}
              style={{ marginRight: '10px' }}
            >
              Révoquer tous les rôles
            </Button>

            {/* Autocomplete pour révoquer un seul rôle */}
            <Autocomplete
              options={roles}
              getOptionLabel={(option) => option.nom_role}
              onChange={(event, newValue) => {
                setRoleToRevoke(newValue ? newValue.nom_role : '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nom du rôle à révoquer"
                  variant="outlined"
                  fullWidth
                  style={{ marginBottom: '20px', marginTop: '20px' }}
                />
              )}
            />

            {/* Bouton pour révoquer un rôle */}
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                if (userIdToRevoke !== null && roleToRevoke) {
                  handleRevokeRole(userIdToRevoke, roleToRevoke);
                }
              }}
              style={{ marginBottom: '10px' }}
            >
              Révoquer le rôle
            </Button>

            {/* Bouton pour annuler */}
            <Button
              onClick={handleCloseDialog}
              color="success"
              variant="contained"
            >
              Annuler
            </Button>
          </Box>
        </Dialog>
      </Box>
    </Container>

  );
};

export default observer(Configuration);
