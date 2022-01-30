const { response } = require("express");
const ObjectId = require('mongodb').ObjectID;

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find().populate('usuario', 'nombre img').populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
}

const getMedico = async(req, res = response) => {

    const id = req.params.id;

    try {

        if (!ObjectId.isValid(id)) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        const medico = await Medico.findById(id).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
        res.json({
            ok: true,
            medico
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}

const creaMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({ usuario: uid, ...req.body });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}

const actualizarMedico = async(req, res = response) => {

    const medicolId = req.params.id;
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(medicolId);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(medicolId, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const borrarMedico = async(req, res = response) => {
    const medicoId = req.params.id;

    try {

        const medicoDB = await Medico.findById(medicoId);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        await Medico.findOneAndDelete(medicoId);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

module.exports = {
    getMedicos,
    getMedico,
    creaMedico,
    actualizarMedico,
    borrarMedico
}