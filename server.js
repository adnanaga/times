const express = require('express');
const path = require('path');
const app = express();

// Set Cross-Origin Isolation headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Serve static files (HTML, CSS, JS)
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/styles', express.static(path.join(__dirname, 'styles')));
// app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
