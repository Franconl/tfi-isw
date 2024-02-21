import "dotenv/config";
import express from "express";
import cors from "express";
import ventaRoute from "./infrastructure/routes/venta.routes";
import authRoute from "./infrastructure/routes/auth.routes"

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3002;

app.use('/api', authRoute);
app.use('/api' , ventaRoute);
app.listen(port, () => console.log(`USER, Listo por el puerto ${port}`));