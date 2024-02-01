import express from 'express';
import bodyParser from 'body-parser';
import routes from './infrastructure/routes/Routes';

const app = express();

// Configuraciones generales
app.use(bodyParser.json());

// Configurar rutas
app.use('/api', routes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
