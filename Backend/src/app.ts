import "dotenv/config";
import express from "express";
import cors from "express";
import ventaRoute from "./infrastructure/routes/venta.routes";
import authRoute from "./infrastructure/routes/auth.routes"
import articuloRoute from "./infrastructure/routes/articulo.routes"
import dbInit from "./infrastructure/database/mongo";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

app.use('/api', authRoute);
app.use('/api' , ventaRoute);
app.use('/api', articuloRoute)
dbInit().then();
app.listen(port, () => console.log(`USER, Listo por el puerto ${port}`));