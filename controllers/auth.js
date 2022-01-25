const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            });
        }

        // Generar el token - JWT (JSONWEBTOKEN)
        const token = await generarJWT(usuarioDB._id);

        res.json({
            ok: true,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // Verificar si el usuario existe
        const usuarioBD = await Usuario.findOne({ email: email });
        let usuario;
        if (!usuarioBD) {
            // Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '**',
                img: picture,
                google: true,
                role: 'USER_ROLE'
            });
        } else {
            // Existe usuario
            usuario = usuarioBD;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el token - JWT (JSONWEBTOKEN)
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el token - JWT (JSONWEBTOKEN)
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}