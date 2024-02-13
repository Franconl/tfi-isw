// router.ts
import express from 'express';
import { VentaService } from '../../aplication/VentaService';
import { VentaServiceController } from '../controllers/VentaServiceController';
import { sesion } from './auth.routes';
import { TarjetaServiceController } from '../controllers/TarjetaServiceController';
import { ConexionTarjetaService } from '../../aplication/ConexionSistTarjetaService';
import { VentaRepository } from '../../repositroy/VentaRepository';
import { afipServiceController } from "../routes/auth.routes";
import { ArticuloMongo } from '../../repositroy/articulo.mongo';
import { ClienteMongo } from '../../repositroy/cliente.mongo';

const router = express.Router();

const ArticuloRepo = new ArticuloMongo();
const ClienteRepo = new ClienteMongo();
const ventaRepo = new VentaRepository()
var ventaService : VentaService = new VentaService(ClienteRepo, ArticuloRepo, sesion, ventaRepo);
var ventaCtrl = new VentaServiceController(ventaService);
var afipService;

var tarjetaService : ConexionTarjetaService;
var tarjetaController : TarjetaServiceController;


  router.post('/venta', async (req, res) => {
    try {

      ventaService.setSesion(sesion);
      

      const venta = await ventaCtrl.nuevaVenta(req, res);


      res.status(200).send(venta);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  router.post('/venta/seleccionar', async (req, res) => {
    try{ 
        const response = await ventaCtrl.seleccionarInventario(req,res);
        res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  router.post('/venta/tarjeta', async (req, res) => {
    try{
      tarjetaService = new ConexionTarjetaService(ventaService);
      tarjetaController = new TarjetaServiceController(tarjetaService);
      const response = await tarjetaController.solicitarToken(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  router.post('/venta/tarjeta/confirmar', async (req,res) =>{
    try{
      const response = await tarjetaController.confirmarPago(req,res);
      ventaCtrl.finalizarVenta();
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


// finalizar seleccion/agregado de articulos
  router.post('/venta/cae' , async (req,res) =>{
    try{
      const response = await afipServiceController.solicitarCae(ventaService);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  })


export default router;
