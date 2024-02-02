// router.ts
import express from 'express';
import { ArticuloMock } from '../../mock/ArticuloMock';
import { VentaService } from '../../aplication/VentaService';
import {ServicioBusquedaClientesMock} from '../../mock/BusquedaClienteMock';
import { VentaServiceController } from '../controllers/VentaServiceController';
import { sesion } from './auth.routes';

const router = express.Router();

const ArticuloRepo = new ArticuloMock();
const ClienteRepo = new ServicioBusquedaClientesMock();

  

  router.post('/venta', async (req, res) => {
    try {
      const ventaService = new VentaService(ClienteRepo, ArticuloRepo, sesion);
      const ventaCtrl = new VentaServiceController(ventaService);
      const venta = await ventaCtrl.nuevaVenta(req, res);
      res.status(200).send(venta);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });




export default router;
