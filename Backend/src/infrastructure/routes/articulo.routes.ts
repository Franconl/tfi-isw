import express from "express";
import { ArticuloMongo } from "../../repositroy/articulo.mongo";
import { ArticuloService } from "../../aplication/ArticuloService";
import { ArticuloController } from "../controllers/ArticuloController";

const router = express.Router();

const articuloRepo = new ArticuloMongo();
const articuloService = new ArticuloService(articuloRepo);
const articuloCtrl = new ArticuloController(articuloService);

router.put('/articulo',async (req,res) =>{
    try{
        const response = await articuloCtrl.crearArticulo(req,res);
        res.status(200).send(response);
      }catch(error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
})

router.put('/categoria',async (req,res) =>{
  try{
      const response = await articuloCtrl.crearCategoria(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
})

router.put('/marca',async (req,res) =>{
  try{
      const response = await articuloCtrl.CrearMarca(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
})

router.put('/tipodetalle',async (req,res) =>{
  try{
      const response = await articuloCtrl.crearTipoDeTalle(req,res);
      res.status(200).send(response);
    }catch(error) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
})

router.get('/articulo', async (req,res) => {
  try{
    const response = await articuloCtrl.buscarArticulo(req,res);
    res.status(200).send(response);
  }catch(error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
})

router.get('/inventario', async (req, res) => {
  try{
    const response = await articuloCtrl.buscarArticuloeInventario(req,res);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.get('/marcas', async (req, res) => {
  try{
    const response = await articuloCtrl.buscarMarcas(req,res);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.get('/categorias', async (req, res) => {
  try{
    const response = await articuloCtrl.buscarCategorias(req,res);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.get('/tipotalles', async (req, res) => {
  try{
    const response = await articuloCtrl.buscarTiposTalle(req,res);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.post('/modificar/articulo', async (req, res) => {
  try{
    const response = await articuloCtrl.modificarArticulo(req,res);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

export default router;