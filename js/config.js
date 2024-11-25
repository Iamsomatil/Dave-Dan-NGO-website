const config = {
    apiBaseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.yourdomain.org'  // Replace with your actual domain
        : 'http://localhost:5501'
};

export default config;
