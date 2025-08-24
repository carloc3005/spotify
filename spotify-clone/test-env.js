// Test if environment variables are loaded
console.log('Environment Variables Check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set ✓' : 'Missing ✗');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set ✓' : 'Missing ✗');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set ✓' : 'Missing ✗');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
