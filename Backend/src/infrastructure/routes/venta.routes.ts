// router.ts
import express from 'express';
import { VentaService } from '../../aplication/VentaService';
import { VentaServiceController } from '../controllers/VentaServiceController';
import { ArticuloMongo } from '../../repositroy/articulo.mongo';
import { ClienteMongo } from '../../repositroy/cliente.mongo';
import { VentaMongo } from '../../repositroy/venta.mongo';
import { UsuarioMongo } from '../../repositroy/usuario.mongo';
import { ConexionAfipService } from '../../aplication/ConexionAfipService';

const router = express.Router();

// CREAR NUEVA VENTA
  router.post('/venta', async (req, res) => {
    try {
      const ArticuloRepo = new ArticuloMongo();
      const ClienteRepo = new ClienteMongo();
      const ventaRepo = new VentaMongo();
      const usuarioRepo = new UsuarioMongo();
      const afipService = new ConexionAfipService();
      const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
      const ventaCtrl = new VentaServiceController(ventaService);

      const venta = await ventaCtrl.nuevaVenta(req, res);


      res.status(200).send(venta);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  //CREAR NUEVO CLIENTE (ENVIAR OBJETO CLIENTE)
  router.put('/cliente', async (req, res) => {
    try{ 
        const ArticuloRepo = new ArticuloMongo();
        const ClienteRepo = new ClienteMongo();
        const ventaRepo = new VentaMongo();
        const usuarioRepo = new UsuarioMongo()
        const afipService = new ConexionAfipService();
        const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
        const ventaCtrl = new VentaServiceController(ventaService);
        const response = await ventaCtrl.crearCliente(req,res);
        res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

  // SELECCIONAR INVENTARIO DE ARTICULO
  router.post('/venta/seleccionar', async (req, res) => {
    try{ 
        const ArticuloRepo = new ArticuloMongo();
        const ClienteRepo = new ClienteMongo();
        const ventaRepo = new VentaMongo();
        const usuarioRepo = new UsuarioMongo()
        const afipService = new ConexionAfipService();
        const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
        const ventaCtrl = new VentaServiceController(ventaService);
        const response = await ventaCtrl.seleccionarInventario(req,res);
        res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


 // ASIGNAR CLIENTE A LA VENTA(POR DEFECTO CLIENTE GENERICO)
  router.post('/venta/cliente', async (req, res) => {
    try{ 
        const ArticuloRepo = new ArticuloMongo();
        const ClienteRepo = new ClienteMongo();
        const ventaRepo = new VentaMongo();
        const usuarioRepo = new UsuarioMongo()
        const afipService = new ConexionAfipService();
        const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
        const ventaCtrl = new VentaServiceController(ventaService);
        const response = await ventaCtrl.setCliente(req,res);
        res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

//INDICAR TIPO DE PAGO
router.post('/venta/pago', async (req, res) => {
  try{ 
      const ArticuloRepo = new ArticuloMongo();
      const ClienteRepo = new ClienteMongo();
      const ventaRepo = new VentaMongo();
      const usuarioRepo = new UsuarioMongo()
      const afipService = new ConexionAfipService();
      const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
      const ventaCtrl = new VentaServiceController(ventaService);
      const response = await ventaCtrl.setPago(req,res);
      res.status(200).send(response);
  }catch(error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

  //SOLICITAR TOKEN DE PAGO CON TARJETA
  router.post('/venta/tarjeta', async (req, res) => {
    try{
      const ArticuloRepo = new ArticuloMongo();
      const ClienteRepo = new ClienteMongo();
      const ventaRepo = new VentaMongo();
      const usuarioRepo = new UsuarioMongo()
      const afipService = new ConexionAfipService();
      const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
      const ventaCtrl = new VentaServiceController(ventaService);
      const response = await ventaCtrl.solicitarToken(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


  // CONFIRMAR PAGO CON TARJETA
  router.post('/venta/tarjeta/confirmar', async (req,res) =>{
    try{
      const ArticuloRepo = new ArticuloMongo();
      const ClienteRepo = new ClienteMongo();
      const ventaRepo = new VentaMongo();
      const usuarioRepo = new UsuarioMongo()
      const afipService = new ConexionAfipService();
      const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
      const ventaCtrl = new VentaServiceController(ventaService);
      const response = await ventaCtrl.confirmarPagoTarjeta(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });


 //finalizar seleccion/agregado de articulos
  router.post('/venta/cae' , async (req,res) =>{
    try{
      const ArticuloRepo = new ArticuloMongo();
      const ClienteRepo = new ClienteMongo();
      const ventaRepo = new VentaMongo();
      const usuarioRepo = new UsuarioMongo()
      const afipService = new ConexionAfipService();
      const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
      const ventaCtrl = new VentaServiceController(ventaService);
      const response = await ventaCtrl.finalizarSeleccion(req,res) ;
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  })

router.post('/venta/finalizar' , async (req,res) =>{
    try{
        const ArticuloRepo = new ArticuloMongo();
        const ClienteRepo = new ClienteMongo();
        const ventaRepo = new VentaMongo();
        const usuarioRepo = new UsuarioMongo()
        const afipService = new ConexionAfipService();
        const ventaService : VentaService = new VentaService(usuarioRepo,ClienteRepo, ArticuloRepo, ventaRepo, afipService);
        const ventaCtrl = new VentaServiceController(ventaService);
        const response = await ventaCtrl.finalizarVenta(req,res);
        res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  })

export default router;
