import { createContext, useContext } from 'react';
import AlertStore from './alertStore';
import AuthStore from './authStore';
import DialogStore from './dialogStore';
import utilisateurStore from './utilisateurStore';
import FournisseurStore from './fournisseurStore';
import ConfigStore from './configStore';
import StockeurStore from './stockeurStore';
import DepotStore from './depotStore';
import BonDeLivraisonStore from './bonDeLivraisonStore';
import ModeDePaiementStore from './modeDePaiementStore';
import FactureStore from './factureStore';
import SenStockStore from './senStockStore';
import DotStore from './dotStore';
import OryxStore from './oryxStore';
import RecapilatifStore from './recapilatifStore';
import IpmStore from './ipmStore';
import { toast, ToastOptions } from 'react-toastify';
if (import.meta.env.NODE_ENV === 'development') {
  import('mobx-logger')
    .then(({ enableLogging }) => {
      enableLogging();
    })
    .catch((error) => {
      console.error('Failed to load mobx-logger:', error);
    });
}

export interface IRootStore {
  handleError: (errorCode: number | null, errorMessage: string, errorData: any) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  alertStore: AlertStore;
  authStore: AuthStore;
  dialogStore: DialogStore;
  utilisateurStore: utilisateurStore;
  fournisseurStore: FournisseurStore;
  configStore: ConfigStore;
  stockeurStore: StockeurStore;
  depotStore: DepotStore;
  bonDeLivraisonStore: BonDeLivraisonStore;
  modeDePaiementStore:  ModeDePaiementStore;
  factureStore: FactureStore;
  senStockStore: SenStockStore;
  dotStore: DotStore;
  oryxStore: OryxStore;
  recapilatifStore: RecapilatifStore;
  ipmStore: IpmStore;
}

export class RootStore implements IRootStore {
  alertStore: AlertStore;
  authStore: AuthStore;
  dialogStore: DialogStore;
  utilisateurStore: utilisateurStore;
  fournisseurStore: FournisseurStore;
  // camionStore: CamionStore;
  configStore: ConfigStore;
  // clientStore: ClientStore;
  stockeurStore: StockeurStore;
  depotStore: DepotStore;
  // bonDeCommandeStore: BonDeCommandeStore;
  bonDeLivraisonStore: BonDeLivraisonStore;
  modeDePaiementStore:  ModeDePaiementStore;
  factureStore: FactureStore;
  senStockStore: SenStockStore;
  dotStore: DotStore;
  oryxStore: OryxStore;
  recapilatifStore: RecapilatifStore;
  ipmStore: IpmStore;
  constructor() {
    console.log('RootStore initialized');
    this.alertStore = new AlertStore(this);
    this.authStore = new AuthStore(this);
    this.dialogStore = new DialogStore(this);
    this.utilisateurStore = new utilisateurStore(this);
    this.fournisseurStore = new FournisseurStore(this);
    // this.camionStore = new CamionStore(this);
    this.configStore = new ConfigStore(this);
    // this.clientStore = new ClientStore(this);
    this.stockeurStore = new StockeurStore(this);
    this.depotStore = new DepotStore(this);
    // this.bonDeCommandeStore = new BonDeCommandeStore(this);
    this.bonDeLivraisonStore = new  BonDeLivraisonStore(this);
    this.modeDePaiementStore = new ModeDePaiementStore(this);
    this.factureStore = new FactureStore(this);
    this.senStockStore = new SenStockStore(this);
    this.dotStore  = new DotStore(this);
    this.oryxStore = new OryxStore(this);
    this.recapilatifStore = new RecapilatifStore(this);
    this.ipmStore = new IpmStore(this);
  }

  public handleError = (errorCode: number | null = null, errorMessage: string, errorData: any) => {
    console.error('Error Data:', errorData);
     // Ignorer l'alerte pour les erreurs 401 (non autorisé) ou tout autre code que vous souhaitez
     if (errorCode === 401 || errorCode === 403) {
      // Dans le cas d'une erreur 403, déconnecter l'utilisateur
      if (errorCode === 403) {
          this.authStore.setIsAuthenticated(false);
      }
      return null; // Sortir sans ouvrir d'alerte
    }
    this.alertStore.open({
      status: 'error',
      message: errorMessage,
    });
  };
  public showNotification = (type: 'success' | 'error', message: string) => {
    const options: ToastOptions  = {
      position: "top-center" ,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      style: { marginTop: '50px' },
    };
  
    if (type === 'success') {
      toast.success(message, options);
    } else {
      toast.error(message, options);
    }
  }
}

// Crée une instance de RootStore
const rootStore = new RootStore();

// Crée le contexte du rootStore
const rootStoreContext = createContext({ rootStore });

// Hook pour accéder au rootStore
export const useStore = () => useContext(rootStoreContext);

