const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// HTML de la app - Generado directamente
const appHTML = `<!DOCTYPE html>
<html lang="es">
