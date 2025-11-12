import Keycloak from 'keycloak-js';

// Keycloak configuration
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'https://keycloak.guven.uk',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'pawcial',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'pawcial-frontend-dev',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

