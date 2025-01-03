import { Navigate, useRoutes } from 'react-router-dom';
import BaseLayout from '../component/layout/BaseLayout';
import PrivateRoute from '../middleware/PrivateRoute';
import Login from '../pages/guest/login';
import Home from '../pages/private/accueil/accueil';
import Utilisateurs from '../pages/private/reseau-approvisionnement/utilisateurs';
import ListUtilisateurs from '../pages/private/reseau-approvisionnement/utilisateurs/list';
import CreatUtilisateurs from '../pages/private/reseau-approvisionnement/utilisateurs/creat';
import EditUtilisateurs from '../pages/private/reseau-approvisionnement/utilisateurs/edit';
import Configuration from '../pages/private/reseau-approvisionnement/configuration/config';
import Config from '../pages/private/reseau-approvisionnement/configuration/index';
import Fournisseurs from '../pages/private/reseau-approvisionnement/fournisseurs';
import FournisseurList from '../pages/private/reseau-approvisionnement/fournisseurs/list';
import EditFournisseur from '../pages/private/reseau-approvisionnement/fournisseurs/edit';
import FournisseurCreate from '../pages/private/reseau-approvisionnement/fournisseurs/creat';
import EditConfig from '../pages/private/reseau-approvisionnement/configuration/edit';
import StockeurEtDepot from '../pages/private/stock/stockeurs/stockeurEtDepot';
import Stockeurs from '../pages/private/stock/stockeurs';
import StockeurList from '../pages/private/stock/stockeurs/list';
import Depots from '../pages/private/stock/depots';
import DepotList from '../pages/private/stock/depots/list';
import ReceptionFacture from '../pages/private/transaction/receptionFacture';
import ReceptionFactureList from '../pages/private/transaction/receptionFacture/list';
import BonDeLivraison from '../pages/private/transaction/bonDeLivraison';
import BonDeLivraisonList from '../pages/private/transaction/bonDeLivraison/list';
import BonDeLivraisonCreate from '../pages/private/transaction/bonDeLivraison/creat';
import EditBonDeLivraison from '../pages/private/transaction/bonDeLivraison/edit';
import ModeDePaiement from '../pages/private/transaction/modeDePaiement';
import ModeDePaiementList from '../pages/private/transaction/modeDePaiement/list';
import ModeDePaiementCreate from '../pages/private/transaction/modeDePaiement/creat';
import EditModeDePaiement from '../pages/private/transaction/modeDePaiement/edit';
import EditStockeur from '../pages/private/stock/stockeurs/editStockeur';
import Facture from '../pages/private/transaction/facture';
import FactureList from '../pages/private/transaction/facture/list';
import FactureCreate from '../pages/private/transaction/facture/creat';
import FactureSave  from '../pages/private/transaction/facture/save';
import FactureFournisseur  from '../pages/private/transaction/facture/facureFournisseur';
// import FactureStockeur  from '../pages/private/transaction/facture/factureStockeur';
import AutreFacture  from '../pages/private/transaction/facture/autreFacture';
import EditFacture from '../pages/private/transaction/facture/edit';
import DetailFacture from '../pages/private/transaction/facture/detail';
// import FactureAvecPassage from '../pages/private/transaction/facture/factureAvecPassageEtFrais';
import StockSenStock from '../pages/private/tableau-de-bord/senStock/senStock';
import TableauBordSenStock from '../pages/private/tableau-de-bord/senStock/index';
import DetailsEntrantIndustrielMois from '../pages/private/tableau-de-bord/senStock/detailsEntrantIndustrielMois';
import DetailsEntrantCommercialMois from '../pages/private/tableau-de-bord/senStock/detailsEntrantCommercialMois';
import DetailsSortieMois from '../pages/private/tableau-de-bord/senStock/detailsSortieMois';
import DetailsStock from '../pages/private/tableau-de-bord/senStock/detailsEtatStock';
import StockDOT from '../pages/private/tableau-de-bord/dot/dot';
import TableauBordDOT from '../pages/private/tableau-de-bord/dot/index';
import DetailsEntrantIndustrielMoisDOT from '../pages/private/tableau-de-bord/dot/detailsEntrantIndustrielMois';
import DetailsEntrantCommercialMoisDOT from '../pages/private/tableau-de-bord/dot/detailsEntrantCommercialMois';
import DetailsSortieMoisDOT from '../pages/private/tableau-de-bord/dot/detailsSortieMois';
import DetailsStockDOT from '../pages/private/tableau-de-bord/dot/detailsEtatStockMensuelle';
import DetailsEntrantCommercialMoisORYX from '../pages/private/tableau-de-bord/oryx/detailsEntrantCommercialMois';
import DetailsSortieMoisORYX from '../pages/private/tableau-de-bord/oryx/detailsSortieMois';
import StockORYX from '../pages/private/tableau-de-bord/oryx/oryx';
import TableauBordORYX from '../pages/private/tableau-de-bord/oryx/index';
import DetailsEntrantIndustrielMoisORYX from '../pages/private/tableau-de-bord/oryx/detailsEntrantIndustrielMois';
import DetailsStockORYX from '../pages/private/tableau-de-bord/oryx/detailsEtatStockMensuelle';
import Recapilatif from '../pages/private/tableau-de-bord/recapilatif/recapilatif';
import TableauDeBordRecapilatif from '../pages/private/tableau-de-bord/recapilatif/index';
// import FactureCreation from '../pages/private/transaction/facture/creationFacture';
import FactureStockeur from '../pages/private/transaction/facture/factureStockeur';
import Ipm from '../pages/private/reseau-approvisionnement/ipm';
import IpmList from '../pages/private/reseau-approvisionnement/ipm/list';
import IpmCreate from '../pages/private/reseau-approvisionnement/ipm/create';
import EditIpm from '../pages/private/reseau-approvisionnement/ipm/edit';
import DetailIpm from '../pages/private/reseau-approvisionnement/ipm/detail';
import FacturePayee from  '../pages/private/tableau-de-bord/recapilatif/facturePayee';
import FactureImpayee from '../pages/private/tableau-de-bord/recapilatif/factureImpayee';
import FacturePaimentEnCours from '../pages/private/tableau-de-bord/recapilatif/facturePaimentEnCours';
import FacturePartiellementPayee from '../pages/private/tableau-de-bord/recapilatif/facturePartiellementPayee';
const routes = [
    { path: "/", element: <Navigate to="login" /> }, // Redirection vers la page de login
    { path: "/login", element: <Login /> }, // Route pour la page de connexion
    {
        path: "/accueil",
        element: <PrivateRoute element={<BaseLayout />} />, children: [
            { path: "", element: <Home /> }, // Route enfant qui s'affiche par défaut
            {path: "reseau-approvisionnement/utilisateurs", element: <PrivateRoute element= {<Utilisateurs/>}/>, children: [
                {path: "", element: <ListUtilisateurs/>},
                {path: "create", element: <CreatUtilisateurs/>},
                {path: "edit/:idUser", element: <EditUtilisateurs/>}
            ]},
            {path: "reseau-approvisionnement/configuration", element: <PrivateRoute element= {<Config/>}/>, children: [
                {path: "", element: <Configuration/>},
                {path: "edit/:id", element: <EditConfig />},
            ]},
            {path: "reseau-approvisionnement/fournisseurs", element: <PrivateRoute element= {<Fournisseurs/>}/>, children: [
                {path: "", element: <FournisseurList/>},
                {path: "create", element: <FournisseurCreate/>},
                {path: "edit/:id", element: <EditFournisseur/>}
            ]},
            {path: "reseau-approvisionnement/ipm", element: <PrivateRoute element= {<Ipm/>}/>, children: [
                {path: "", element: <IpmList/>},
                {path: "create", element: <IpmCreate />},
                {path: "edit/:id", element: <EditIpm />},
                {path: "detail/:id", element: <DetailIpm/>},
            ]},
            // {path: "clients/autre", element: <PrivateRoute element= {<Clients/>}/>, children: [
            //     {path: "", element: <ClientList/>},
            //     {path: "create", element: <ClientCreate/>},
            //     {path: "edit/:id", element: <EditClient/>},
            // ]},
            // {path: "clients/station-service", element: <PrivateRoute element= {<StationService/>}/>, children: [
            //     {path: "", element: <StationServiceList/>},
            //     {path: "create", element: <StationServiceCreate/>},
            //     {path: "edit/:id", element: <EditStationService/>},
            // ]},
            // {path: "clients/boulangerie", element: <PrivateRoute element= {<Boulangerie/>}/>, children: [
            //     {path: "", element: <BoulangerieList/>},
            //     {path: "create", element: <BoulangerieCreate/>},
            //     {path: "edit/:id", element: <EditBoulangerie/>},
            // ]},
            // {path: "clients/garage-automobile", element: <PrivateRoute element= {<GarageAutomobile/>}/>, children: [
            //     {path: "", element: <GarageAutomobileList/>},
            //     {path: "create", element: <GarageAutomobileCreate/>},
            //     {path: "edit/:id", element: <EditGarageAutomobile/>},
            // ]},
            {path: "stock/stockeur", element: <PrivateRoute element= {<Stockeurs/>}/>, children: [
                {path: "", element: <StockeurList/>},
                {path: "create", element: <StockeurEtDepot />},
                {path: "edit/:id", element: <EditStockeur />},
            ]},
            {path: "stock/depot", element: <PrivateRoute element= {<Depots/>}/>, children: [
                {path: "", element: <DepotList/>},

            ]},
            {path: "transaction/reception-facture", element: <PrivateRoute element= {<ReceptionFacture/>}/>, children: [
                {path: "", element: <ReceptionFactureList/>},
                {path: "detail/:id", element: <DetailFacture/>},
            ]},
            {path: "transaction/bon-livraison", element: <PrivateRoute element= {<BonDeLivraison/>}/>, children: [
                {path: "", element: <BonDeLivraisonList/>},
                {path: "create", element: <BonDeLivraisonCreate/>},
                {path: "edit/:id", element: <EditBonDeLivraison/>},
            ]},
            {path: "transaction/mode-paiement", element: <PrivateRoute element= {<ModeDePaiement/>}/>, children: [
                {path: "", element: <ModeDePaiementList/>},
                {path: "create", element: <ModeDePaiementCreate/>},
                {path: "edit/:id", element: <EditModeDePaiement/>},
            ]},
            {path: "transaction/facture", element: <PrivateRoute element= {<Facture/>}/>, children: [
                {path: "", element: <FactureList/>},
                {path: "create", element: <FactureCreate/>},
                {path: "save", element: <FactureSave/>},
                {path: "enregistrement-fournisseur", element: <FactureFournisseur/>},
                {path: "enregistrement-stockeur", element: <FactureStockeur/>},
                // {path: "creation-facture", element: <FactureCreation/>},
                {path: "enregistrement-autre", element: <AutreFacture/>},
                {path: "edit/:id", element: <EditFacture/>},
                {path: "detail/:id", element: <DetailFacture/>},
            ]},
            {path: "tableau-de-bord/senstock", element: <PrivateRoute element= {<TableauBordSenStock/>}/>, children: [
                {path: "", element: <StockSenStock/>},
                {path: "detailsInputStockIndustrielForMonth", element: <DetailsEntrantIndustrielMois/>},
                {path: "detailsInputStockCommercialForMonth", element: <DetailsEntrantCommercialMois/>},
                {path: "detailsOutPutStockForMonth", element: <DetailsSortieMois/>},
                {path: "detailsStock", element: <DetailsStock/>},
            ]},
            {path: "tableau-de-bord/dot", element: <PrivateRoute element= {<TableauBordDOT/>}/>, children: [
                {path: "", element: <StockDOT/>},
                {path: "detailsInputStockIndustrielForMonth", element: <DetailsEntrantIndustrielMoisDOT/>},
                {path: "detailsInputStockCommercialForMonth", element: <DetailsEntrantCommercialMoisDOT/>},
                {path: "detailsOutPutStockForMonth", element: <DetailsSortieMoisDOT/>},
                {path: "detailsStock", element: <DetailsStockDOT/>},
            ]},
            {path: "tableau-de-bord/oryx", element: <PrivateRoute element= {<TableauBordORYX/>}/>, children: [
                {path: "", element: <StockORYX/>},
                {path: "detailsInputStockIndustrielForMonth", element: <DetailsEntrantIndustrielMoisORYX/>},
                {path: "detailsInputStockCommercialForMonth", element: <DetailsEntrantCommercialMoisORYX/>},
                {path: "detailsOutPutStockForMonth", element: <DetailsSortieMoisORYX/>},
                {path: "detailsStock", element: <DetailsStockORYX/>},
            ]},
            {path: "tableau-de-bord/recapilatif", element: <PrivateRoute element= {<TableauDeBordRecapilatif/>}/>, children: [
                {path: "", element: <Recapilatif/>},
                {path: "detailsFacturesPayees", element: <FacturePayee/>},
                {path: "detailsFacturesImpayees", element: <FactureImpayee/>},
                {path: "detailsFacturePartiellementPayee", element: <FacturePartiellementPayee/>},
                {path: "detailsFacturePaimentEnCours", element: <FacturePaimentEnCours/>},
            ]},
        ]
    }
];
const Approutes = () => {
    const route = useRoutes(routes); // Utilisation de useRoutes pour gérer les routes
    return route;
}

export default Approutes;
