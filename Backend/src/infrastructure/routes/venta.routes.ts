// router.ts
import express from 'express';
import { ArticuloMock } from '../../mock/ArticuloMock';
import { VentaService } from '../../aplication/VentaService';
import {ServicioBusquedaClientesMock} from '../../mock/BusquedaClienteMock';
import { VentaServiceController } from '../controllers/VentaServiceController';
import { sesion } from './auth.routes';
import { Inventario } from '../../domain/entities/Inventario';

const router = express.Router();

const ArticuloRepo = new ArticuloMock();
const ClienteRepo = new ServicioBusquedaClientesMock();
var ventaService : VentaService;
var ventaCtrl : VentaServiceController;
  

  router.post('/venta', async (req, res) => {
    try {
      ventaService = new VentaService(ClienteRepo, ArticuloRepo, sesion);
      ventaCtrl = new VentaServiceController(ventaService);
      const venta = await ventaCtrl.nuevaVenta(req, res);
      res.status(200).send(venta);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  router.get('/articulo', async (req, res) => {
    try{
      const response = await ventaCtrl.buscarArticulo(req,res);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  router.post('/venta/inventario', async (req, res) => {
      const response = ventaCtrl.seleccionarArticulo(req,res);
      res.status(200).send(response);
    
  })




export default router;
