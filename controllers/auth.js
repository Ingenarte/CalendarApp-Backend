const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    // console.log(usuario);
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo',
      });
    }
    usuario = new Usuario(req.body);

    //Encriptar contrasena
    const salt = bcrypt.genSaltSync(10); // genera el salt
    usuario.password = bcrypt.hashSync(password, salt); // hace el hash con el salt

    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el ADMIN' });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    // console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario NO existe con ese correo',
      });
    }

    //Confirmar los passwords

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword)
      return res.status(400).json({ ok: false, msg: 'Password incorrecto' });

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({ ok: true, uid: usuario.id, name: usuario.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Por favor hable con el ADMIN' });
  }
};

const revalidarToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;
  const token = await generarJWT(uid, name);

  res.json({ ok: true, name: name, user: uid, token });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
