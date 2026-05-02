// Token Manager - Use in your frontend application
// This utility handles storing, retrieving, and managing JWT tokens in localStorage

const TokenManager = {
    // Store tokens after login
    setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    // Get access token
    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    // Get refresh token
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    // Clear all tokens on logout
    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    // Make authenticated API request with Bearer token
    async fetchWithAuth(url, options = {}) {
        const accessToken = this.getAccessToken();

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        // If unauthorized, try to refresh token
        if (response.status === 403) {
            const refreshed = await this.refreshAccessToken();
            if (refreshed) {
                // Retry the original request with new token
                return this.fetchWithAuth(url, options);
            } else {
                // Refresh failed, redirect to login
                this.clearTokens();
                window.location.href = '/login';
            }
        }

        return response;
    },

    // Refresh access token using refresh token
    async refreshAccessToken() {
        try {
            const refreshToken = this.getRefreshToken();

            if (!refreshToken) {
                return false;
            }

            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                this.clearTokens();
                return false;
            }

            const data = await response.json();
            const newAccessToken = data.accessToken;

            // Update access token in localStorage
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            this.clearTokens();
            return false;
        }
    },

    // Logout and clear tokens
    async logout() {
        try {
            const refreshToken = this.getRefreshToken();
            
            if (refreshToken) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refreshToken })
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getAccessToken();
    }
};

// Export for use in your frontend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenManager;
}
