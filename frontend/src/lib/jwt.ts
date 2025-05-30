/**
 * Interface pour le payload JWT décodé
 */
export interface JWTPayload {
  role?: string;
  id?: string;      // Le backend utilise 'id' pour l'identifiant utilisateur
  login?: string;
  email?: string;
  exp?: number; // timestamp d'expiration
  iat?: number; // timestamp de création
  [key: string]: any; // autres propriétés potentielles
}

/**
 * Décode un token JWT côté client/serveur sans vérification de signature
 * 
 * IMPORTANT: Cette fonction ne vérifie PAS la signature du token.
 * La vérification de signature doit être effectuée côté backend.
 * 
 * @param token - Le token JWT à décoder
 * @param checkExpiration - Si true, vérifie si le token n'est pas expiré (défaut: true)
 * @returns Le payload décodé ou null en cas d'erreur
 */
export function decodeTokenUnsafe(token: string, checkExpiration: boolean = true): JWTPayload | null {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // Séparer le token en ses parties
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Format de token JWT invalide');
      return null;
    }

    // Décoder la partie payload (deuxième partie)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Décoder base64 et convertir en JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    const payload: JWTPayload = JSON.parse(jsonPayload);
    
    // Vérifier l'expiration si demandé
    if (checkExpiration && payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token JWT expiré');
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Erreur lors du décodage du token JWT:', error);
    return null;
  }
}

/**
 * Vérifie si un token JWT est valide (non expiré et bien formé)
 * 
 * @param token - Le token JWT à vérifier
 * @returns true si le token est valide, false sinon
 */
export function isTokenValid(token: string): boolean {
  const payload = decodeTokenUnsafe(token, true);
  return payload !== null;
}

/**
 * Extrait le rôle utilisateur d'un token JWT
 * 
 * @param token - Le token JWT
 * @returns Le rôle utilisateur ou null
 */
export function getRoleFromToken(token: string): string | null {
  const payload = decodeTokenUnsafe(token);
  return payload?.role || null;
}

/**
 * Extrait l'ID utilisateur d'un token JWT
 * 
 * @param token - Le token JWT
 * @returns L'ID utilisateur ou null
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeTokenUnsafe(token);
  // Le backend utilise 'id' dans le token JWT
  return payload?.id || null;
}
