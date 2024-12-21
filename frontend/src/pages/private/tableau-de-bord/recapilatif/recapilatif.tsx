import { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Typography} from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { Link } from 'react-router-dom';
interface FactureData {
    nombre_facture: number;
    total_montant_factures: number;
}
const Recapilatif = () => {
  const { rootStore: { recapilatifStore} } = useStore();
  const [dataFacturePayee, setdataFacturePayee] = useState<FactureData | null>(null);
  const [dataFactureImpayee, setDataFactureImpayee] = useState<FactureData | null>(null);
  const [dataFacturePayeePartiellement, setDataFacturePayeePartiellement] = useState<FactureData | null>(null);
  const [dataFacturePaimentEnCours, setdDataFacturePaimentEnCours] = useState<FactureData | null>(null);
  const { getDataFacturePaye, getDataFactureImpayee , getDataPaiementEnCours,getDataPayeePartiellement}=  recapilatifStore;
  const facturePaye = async () => {
    try {
      const resData = await getDataFacturePaye();

      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par getDataFacturePaye");
        return;
      }
    
      setdataFacturePayee(resData);
      console.log("Les factures payees:", resData);

    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  const factureImpayee = async () => {
    try {
      const resData = await getDataFactureImpayee();
      
      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par getDataFactureImpayee");
        return;
      }
      setDataFactureImpayee(resData);
      console.log("Les donnees de facture impaye:", resData);
    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  const facturePayeePartiellement = async () => {
    try {
      const resData = await getDataPayeePartiellement();
      
      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par getDataPayeePartiellement");
        return;
      }

      setDataFacturePayeePartiellement(resData);
      console.log("Les donnees de facture impaye:", resData);
    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  const facturePayeePaimentEnCours = async () => {
    try {
      const resData = await getDataPaiementEnCours();
      
      if (!resData) {
        console.error("Aucune donnée n'a été renvoyée par getDataPaiementEnCours");
        return;
      }

      setdDataFacturePaimentEnCours(resData);
      console.log("Les donnees de facture de paiement en cours:", resData);
    } catch (error) {
      console.log("Erreur de téléchargement des données", error);
    }
  };
  useEffect(() => {
    factureImpayee();
    facturePaye();
    facturePayeePartiellement();
    facturePayeePaimentEnCours()
  }, []);

  if (!dataFacturePayee) {
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
           L'état des dernières factures
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
            Facture Payee
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                Nombre de facture : {dataFacturePayee.nombre_facture}</Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                Montant Total: {dataFacturePayee.total_montant_factures}-CFA</Typography>
         </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" color='success' component={Link} to={'detailsFacturesPayees'}>
            Details
          </Button>
        </CardActions>
      </Card>
    </Box>
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center',padding:'5px' }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid',
         borderColor: 'green', color: 'green', }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div"
           gutterBottom textAlign="center" sx={{ marginBottom: 3,color:'red' }}>
            Facture Impayee
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Nombre de facture: {dataFactureImpayee?.nombre_facture}</Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Montant Total: {dataFactureImpayee?.total_montant_factures}-CFA</Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" color='success' component={Link} to={'detailsFacturesImpayees'}>
            Details
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
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center',padding:'5px' }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'white', color: 'white' , background:'green'}}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div" gutterBottom textAlign="center" sx={{ marginBottom: 3 }}>
            Factures Payee Partiellement
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Nombre de facture: {dataFacturePayeePartiellement?.nombre_facture} </Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Montant Total: {dataFacturePayeePartiellement?.total_montant_factures}-CFA</Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" sx={{ paddingX: 4, paddingY: 1.5,
             backgroundColor: 'white', color: 'green'}} component={Link} to={'detailsFacturePartiellementPayee'}>
            Details
          </Button>
        </CardActions>
      </Card>
    </Box>

    {/* Nouvelle carte 2 */}
    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center',padding:'5px' }}>
      <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'white',backgroundColor:'green', color: 'white' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="div" gutterBottom textAlign="center" sx={{ marginBottom: 3 }}>
            Facture Paiemment en cours
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="left" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Nombre de facture: {dataFacturePaimentEnCours?.nombre_facture} </Typography>
              <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>Montant Total: {dataFacturePaimentEnCours?.total_montant_factures}-CFA</Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
          <Button variant="contained" sx={{ paddingX: 4, paddingY: 1.5,
             backgroundColor: 'white', color: 'green'}} component={Link} to={'detailsFacturePaimentEnCours'}>
            Details
          </Button>
        </CardActions>
      </Card>
    </Box>
    </Box>
  </Box>
  );
};

export default Recapilatif;
