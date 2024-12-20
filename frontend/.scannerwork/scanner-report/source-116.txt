import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { IRootStore } from '../store/rootStore';
import BonDeLivraisonStore from '../store/bonDeLivraisonStore';
describe('BonDeLivraisonStore', () => {
  let mockAxios: MockAdapter;
  let rootStoreMock: IRootStore;
  let bonDeLivraisonStore: BonDeLivraisonStore;

  beforeEach(() => {
    // Initialiser un mock Axios
    mockAxios = new MockAdapter(axios);
    // Mock du rootStore
    rootStoreMock = {
      authStore: {
        token: 'fake-token',
      },
      handleError: vi.fn(),
      showNotification: vi.fn(),
      dialogStore: {
        openDialog: vi.fn(),
        closeDialog: vi.fn(),
      },
      alertStore: {
        open: vi.fn(),
      },
    } as unknown as IRootStore;

    // Instancier la classe à tester
    bonDeLivraisonStore = new BonDeLivraisonStore(rootStoreMock);
    bonDeLivraisonStore.rowData = 
    [
      { id: 8,
        designations: "[{\"designation\":\"Gazoil\",\"quantite\":2000},{\"designation\":\"Essence\",\"quantite\":1000},{\"designation\":\"Diesel\",\"quantite\":2500}]", 
       
        destinataire: 'Bon 1', UniteDeMesure:'litre', numeroBonDeLivraison:70002
      }, 
      {
        id: 9,
        destinataire: 'Bon 2',
        UniteDeMesure: 'litre',
        designations: "[{\"designation\":\"Gazoil\",\"quantite\":1500}]",
        numeroBonDeLivraison: 70003,
    },
      ];  
    // Mock de la méthode setRowData
    vi.spyOn(bonDeLivraisonStore, 'setRowData');
  });
  it('should open the dialog, confirm deletion, and update the rowData', async () => {
    // Données initiales
    bonDeLivraisonStore.rowData = [
        {
            id: 8,
            designations: "[{\"designation\":\"Gazoil\",\"quantite\":2000},{\"designation\":\"Essence\",\"quantite\":1000},{\"designation\":\"Diesel\",\"quantite\":2500}]",
            destinataire: 'Bon 1',
            UniteDeMesure: 'litre',
            numeroBonDeLivraison: 70002,
        },
        {
            id: 9,
            designations: "[{\"designation\":\"Gazoil\",\"quantite\":1500}]",
            destinataire: 'Bon 2',
            UniteDeMesure: 'litre',
            numeroBonDeLivraison: 70003,
        },
    ];

    const mockParams = { row: { id: 8 } };

    // Appel de la méthode deleteDialog
    bonDeLivraisonStore.deleteDialog(mockParams);

    // Vérifier que openDialog a été appelé avec les bons paramètres
    expect(rootStoreMock.dialogStore.openDialog).toHaveBeenCalledWith({
        confirm: expect.any(Function),
        dialogText: "Êtes-vous sûr de vouloir supprimer cet bon de livraison ?",
    });

    // Simuler l'appel de la fonction confirm
    const dialogOptions = (rootStoreMock.dialogStore.openDialog as jest.Mock).mock.calls[0][0];
    await dialogOptions.confirm();

    // Vérifier que setRowData a été appelée avec les données mises à jour (l'élément avec id: 8 supprimé)
    expect(bonDeLivraisonStore.setRowData).toHaveBeenCalledWith([
        {
            id: 9,
            designations: "[{\"designation\":\"Gazoil\",\"quantite\":1500}]",
            destinataire: 'Bon 2',
            UniteDeMesure: 'litre',
            numeroBonDeLivraison: 70003,
        },
    ]);

    // Vérifier que showNotification a été appelée avec les bons arguments
    expect(rootStoreMock.showNotification).toHaveBeenCalledWith(
        'success',
        "Bon de livraison retiré de l'affichage avec succès!"
    )
    // Vérifier que closeDialog a été appelée
    expect(rootStoreMock.dialogStore.closeDialog).toHaveBeenCalled();
});
  it('devrait récupérer les données de bon de livraison avec succès', async () => {
    // Mock de la réponse de l'API
    mockAxios.onGet(`${bonDeLivraisonStore.BASE_URL}/list`).reply(200, {
        error: false,
        data: [
          { id: 1, designations: "[{\"designation\":\"Gazoil\",\"quantite\":100}]", destinataire: "Client A" },
          { id: 2, designations: "[{\"designation\":\"Super\",\"quantite\":200}]", destinataire: "Client B" },
        ],
      });
      

    // Appeler la méthode à tester
    await bonDeLivraisonStore.bonDeLivraisonLists();

    // Vérifier que les données ont été correctement mises à jour
    expect(bonDeLivraisonStore.rowData).toEqual([
        { id: 1, designations: "[{\"designation\":\"Gazoil\",\"quantite\":100}]", destinataire: "Client A" },
        { id: 2, designations: "[{\"designation\":\"Super\",\"quantite\":200}]", destinataire: "Client B" },
      ]);      
    expect(rootStoreMock.handleError).not.toHaveBeenCalled();
  });

  it('devrait gérer une erreur si le token est manquant', async () => {
    // Supprimer le token pour simuler une erreur
    rootStoreMock.authStore.token = null;

   // Appeler la méthode et vérifier qu'elle rejette une promesse
   await expect(bonDeLivraisonStore.bonDeLivraisonLists()).rejects.toBe('Token manquant');
   
    // Vérifier que handleError a été appelé avec le bon statut
    expect(rootStoreMock.handleError).toHaveBeenCalledWith(401, 'Token manquant', {});
  });

  it('devrait gérer une erreur serveur correctement', async () => {
    // Mock d'une erreur serveur
    mockAxios.onGet(`${bonDeLivraisonStore.BASE_URL}/list`).reply(500, {
      message: 'Request failed with status code 500',
    });

    // Appeler la méthode
    await bonDeLivraisonStore.bonDeLivraisonLists();

    // Vérifier que handleError a été appelé avec les bons arguments
    expect(rootStoreMock.handleError).toHaveBeenCalledWith(
      500,
      'Request failed with status code 500',
      expect.any(Object)
    );
  });
  it('devrait créer des données avec succès', async () => {
    // Mock de la réponse Axios
    const postData = { designations:"[{\"designation\":\"Gazoil\",\"quantite\":2000},{\"designation\":\"Super\",\"quantite\":3000}]",
       numeroBonDeLivraison: 70002,destinataire: 'senstock' };
    const successResponse = { error: false, message: 'Création réussie' };

    mockAxios.onPost(`${bonDeLivraisonStore.BASE_URL}/creat`).reply(200, successResponse);

    // Appeler la méthode createData
    const result = await bonDeLivraisonStore.createData(postData);

    // Vérifier le résultat
    expect(result).toEqual(successResponse);
    expect(rootStoreMock.handleError).not.toHaveBeenCalled();
  });

  it('devrait gérer une réponse avec error: true', async () => {
    const postData = {designations:"[{\"designation\":\"Super\",\"quantite\":1000}]" , destinataire:'DOT',UniteDeMesure:'litre',};
    const errorResponse = { error: true, message: 'Erreur de validation' };

    mockAxios.onPost(`${bonDeLivraisonStore.BASE_URL}/creat`).reply(200, errorResponse);

    // Appeler la méthode et vérifier qu'elle rejette une promesse
    await expect(bonDeLivraisonStore.createData(postData)).rejects.toEqual(errorResponse);

    // Vérifier que handleError a été appelé
    expect(rootStoreMock.handleError).toHaveBeenCalledWith(200, 'Erreur de validation', errorResponse);
  });

  it('devrait gérer une erreur de serveur (500)', async () => {
    const postData = { designation: 'Super', quantite: 200 };

    mockAxios.onPost(`${bonDeLivraisonStore.BASE_URL}/creat`).reply(500, {
      message: 'Erreur interne du serveur',
    });

    await expect(bonDeLivraisonStore.createData(postData)).rejects.toEqual('Erreur interne du serveur');

    expect(rootStoreMock.handleError).toHaveBeenCalledWith(
      500,
      'Erreur interne du serveur',
      expect.any(Object)
    );
  });

  it('devrait gérer une erreur réseau (pas de réponse)', async () => {
    const postData = { designation: 'Diesel', quantite: 300 };

    mockAxios.onPost(`${bonDeLivraisonStore.BASE_URL}/creat`).networkError();

    await expect(bonDeLivraisonStore.createData(postData)).rejects.toEqual('Network Error');

    expect(rootStoreMock.handleError).toHaveBeenCalledWith(
      500,
      'Network Error',
      expect.any(Object)
    );
  });

  it('devrait gérer une erreur de configuration', async () => {
    const postData = { designation: 'Gazoil', quantite: 400 };

    // Simuler une erreur de configuration
    mockAxios.onPost(`${bonDeLivraisonStore.BASE_URL}/creat`).timeout();

    await expect(bonDeLivraisonStore.createData(postData)).rejects.toEqual(
      'timeout of 0ms exceeded'
    );

    expect(rootStoreMock.handleError).toHaveBeenCalledWith(500, 'timeout of 0ms exceeded', expect.any(Object));
  });
  it('devrait récupérer les données correctement', async () => {
    const mockId = 123;
    const mockResponse = { id: mockId, designation: 'Diesel', quantite: 500 };

    // Simuler une réponse réussie d'Axios
    mockAxios.onGet(`${bonDeLivraisonStore.BASE_URL}/${mockId}`).reply(200, mockResponse);

    const result = await bonDeLivraisonStore.getData(mockId);

    // Vérifier que la réponse est correcte
    expect(result).toEqual(mockResponse);
  });

  it('devrait gérer une erreur de réponse du serveur', async () => {
    const mockId = 123;
    const mockError = { message: 'Internal Server Error', error: true };

    // Simuler une erreur dans la réponse Axios
    mockAxios.onGet(`${bonDeLivraisonStore.BASE_URL}/${mockId}`).reply(500, mockError);

    await expect(bonDeLivraisonStore.getData(mockId)).rejects.toThrowError('Erreur serveur');

    // Vérifier que handleError est appelé avec les bons arguments
    expect(rootStoreMock.handleError).toHaveBeenCalledWith(500, 'Erreur serveur', mockError);
  });

  it('devrait gérer une erreur de requête (pas de réponse)', async () => {
    const mockId = 123;

    // Simuler une erreur de réseau (pas de réponse d'Axios)
    mockAxios.onGet(`${bonDeLivraisonStore.BASE_URL}/${mockId}`).networkError();

    await expect(bonDeLivraisonStore.getData(mockId)).rejects.toThrowError('something went wrong');

    // Vérifier que handleError est appelé avec les bons arguments
    expect(rootStoreMock.handleError).toHaveBeenCalledWith(419, 'something went wrong', expect.anything());
  });

  it('devrait gérer une erreur de timeout', async () => {
    const mockId = 50;

    // Simuler une erreur de timeout d'Axios
    mockAxios.onGet(`${bonDeLivraisonStore.BASE_URL}/${mockId}`).timeout();

    await expect(bonDeLivraisonStore.getData(mockId)).rejects.toThrowError('something went wrong');

    // Vérifier que handleError est appelé avec les bons arguments
    expect(rootStoreMock.handleError).toHaveBeenCalledWith(419, 'something went wrong', expect.anything());
  });
  afterEach(() => {
    mockAxios.reset(); // Réinitialise les mocks d'Axios après chaque test
  });

  describe('updateData', () => {
    const mockId = 123;
    const mockData = { field1: 'value1', field2: 'value2' };

    it('devrait mettre à jour les données avec succès', async () => {
      const mockResponse = {
        success: true,
        message: 'Bon de livraison mis à jour avec succès!',
      };

      // Mock de la requête PUT avec une réponse 200
      mockAxios.onPut(`${bonDeLivraisonStore.BASE_URL}/${mockId}`).reply(200, mockResponse);

      const result = await bonDeLivraisonStore.updateData(mockId, mockData);

      // Vérifie que la méthode retourne les données attendues
      expect(result).toEqual(mockResponse);

      // Vérifie que showNotification a été appelée avec le bon message
      expect(rootStoreMock.showNotification).toHaveBeenCalledWith(
        'success',
        'Bon de livraison mis a jour avec  avec succès!'
      );

      // Vérifie que handleError et alertStore.open ne sont pas appelés
      expect(rootStoreMock.handleError).not.toHaveBeenCalled();
      expect(rootStoreMock.alertStore.open).not.toHaveBeenCalled();
    });

      it("devrait gérer une erreur côté serveur", async () => {
        // Simulation d'une réponse d'erreur du serveur
        mockAxios.onPut(`/api/endpoint/${mockId}`).reply(400, {
            message: "Erreur lors de la mise à jour!",
        });
    
        const mockResponse = {
            error: true,
            message: "Erreur lors de la mise à jour!",
        };
    
        await expect(bonDeLivraisonStore.updateData(mockId, mockData)).rejects.toEqual(mockResponse);
     });
    
     it("devrait gérer une erreur réseau", async () => {
      mockAxios.onPut(`${bonDeLivraisonStore.BASE_URL}/${mockId}`).networkError();
  
      const mockResponse = {
          error: true,
          message: "Erreur lors de la mise à jour!",
      };
  
      await expect(bonDeLivraisonStore.updateData(mockId, mockData)).rejects.toEqual(mockResponse);
  });
  
  });
});
