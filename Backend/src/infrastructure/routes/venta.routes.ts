// router.ts
import express from 'express';
import { ArticuloMock } from '../../mock/ArticuloMock';
import { VentaService } from '../../aplication/VentaService';
import {ServicioBusquedaClientesMock} from '../../mock/BusquedaClienteMock';
import { VentaServiceController } from '../controllers/VentaServiceController';
import { sesion } from './auth.routes';
import { Inventario } from '../../domain/entities/Inventario';
import { ConexionAfipService } from '../../aplication/ConexionAfipService';
import { AfipServiceController } from '../controllers/AfipServiceController';
import { TarjetaServiceController } from '../controllers/TarjetaServiceController';
import { ConexionTarjetaService } from '../../aplication/ConexionSistTarjetaService';

const router = express.Router();

const ArticuloRepo = new ArticuloMock();
const ClienteRepo = new ServicioBusquedaClientesMock();
var ventaService : VentaService = new VentaService(ClienteRepo, ArticuloRepo, sesion);
const ventaCtrl = new VentaServiceController(ventaService);
const afipService = new ConexionAfipService(ventaService);
const afipConroller = new AfipServiceController(afipService);
const tarjetaService = new ConexionTarjetaService();
const tarjetaController = new TarjetaServiceController(tarjetaService);
//afipConroller.solicitarToken();

//afipConroller.solicitarUltimoComprobante();

  router.post('/venta', async (req, res) => {
    try {

      ventaService.setSesion(sesion);

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
    try{ 
        const response = await ventaCtrl.seleccionarArticulo(req,res);
        res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  router.get('/venta/tarjeta', async (req, res) => {
    try{
      const response = await tarjetaController.solicitarToken(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


export default router;
