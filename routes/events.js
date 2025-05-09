// Event Routes /api/events

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  getEventos,
  crearEventos,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

router.use(validarJWT); // Todas tienen que validar token

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo evento
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEventos
);

// Actualizar evento
router.put('/:id', actualizarEvento);

// Borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router;
