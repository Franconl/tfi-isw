import "dotenv/config";
import express from "express";
import cors from "cors";
import ventaRoute from "./infrastructure/routes/venta.routes";
import authRoute from "./infrastructure/routes/auth.routes"
import articuloRoute from "./infrastructure/routes/articulo.routes"
import dbInit from "./infrastructure/database/mongo";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3002;

app.use('/api', authRoute);
app.use('/api', ventaRoute);
app.use('/api', articuloRoute);

dbInit().then(() => {
  app.listen(port, () => console.log(`Servidor listo en el puerto ${port}`));
});