// Rutas de Usarios / Auth
// host + api/route

const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const { check } = require('express-validator');

const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

// router.get('/', (req, res) => {
//   res.json({
//     ok: true,
//   });
// });

router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),

    validarCampos,
  ],
  loginUsuario
);
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
