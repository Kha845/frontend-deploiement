
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AuthStore from '../store/authStore';
import { IRootStore } from '../store/rootStore';

describe('AuthStore', () => {
  let authStore: AuthStore;
  let mockAxios: MockAdapter;
  let mockRootStore: IRootStore;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    mockRootStore = {
      handleError: vi.fn(),
    } as unknown as IRootStore; // Simulez les dépendances de rootStore
    authStore = new AuthStore(mockRootStore);
  });

  afterEach(() => {
    mockAxios.reset();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.token).toBeNull();
    expect(authStore.userInfo).toBeNull();
  });

  describe('setIsAuthenticated', () => {
    it('should set isAuthenticated to true', () => {
      authStore.setIsAuthenticated(true);
      expect(authStore.isAuthenticated).toBe(true);
    });

    it('should set isAuthenticated to false and clear token', () => {
      authStore.setToken('test-token');
      authStore.setIsAuthenticated(false);
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.token).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage and update the store', () => {
      const token = 'test-token';
      authStore.setToken(token);
      expect(localStorage.getItem('_token')).toBe(token);
      expect(authStore.token).toBe(token);
    });

    it('should remove token from localStorage if null is passed', () => {
      authStore.setToken('test-token');
      authStore.setToken(null);
      expect(localStorage.getItem('_token')).toBeNull();
      expect(authStore.token).toBeNull();
    });
  });

  describe('login', () => {
    const postData = { username: 'richard.devaux@example.org', password: 'password' };
    const mockResponse = {
      access_token: 'test-access-token',
      user: {
        prenom: 'Moustapha',
        nom: 'Gueye',
        roles: ['DGA'],
      },
    };

    it('should set token and userInfo on successful login', async () => {
      mockAxios.onPost(`${authStore.BASE_URL}/login`).reply(200, mockResponse);

      await authStore.login(postData);

      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.token).toBe(mockResponse.access_token);
      expect(authStore.userInfo).toEqual(mockResponse.user);
    });

    it('should call handleError on API error', async () => {
      mockAxios.onPost(`${authStore.BASE_URL}/login`).reply(401, { message: 'Unauthorized' });

      await expect(authStore.login(postData)).rejects.toThrow('Unauthorized');

      expect(mockRootStore.handleError).toHaveBeenCalledWith(
        401,
        'Unauthorized',
        expect.anything()
      );
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.token).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear token and set isAuthenticated to false on successful logout', async () => {
      authStore.setToken('test-token');
      mockAxios.onPost(`${authStore.BASE_URL}/logout`).reply(200, { message: 'Logged out' });

      await authStore.logout();

      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.token).toBeNull();
      expect(localStorage.getItem('_token')).toBeNull();
    });

    it('should call handleError on API error during logout', async () => {
      authStore.setToken('test-token');
      mockAxios.onPost(`${authStore.BASE_URL}/logout`).reply(500, { message: 'Server error' });

      await authStore.logout();

      expect(mockRootStore.handleError).toHaveBeenCalledWith(
        500,
        'Request failed with status code 500',  // Message d'erreur réel
         expect.any(Error)  // Utilisation de expect.any() pour accepter n'importe quel objet d'erreur
      );
    });

    it('should reject if token is missing', async () => {
      authStore.setToken(null);

      await expect(authStore.logout()).rejects.toEqual('Token manquant');

      expect(mockRootStore.handleError).toHaveBeenCalledWith(401, 'Token manquant', {});
    });
  });

  describe('getUserInfo', () => {
    it('should return userInfo', () => {
      const mockUser = { prenom: 'Jane', nom: 'Doe', roles: ['user'] };
      authStore.userInfo = mockUser;

      expect(authStore.getUserInfo()).toEqual(mockUser);
    });
  });
});
