const Biodata = require('../model/biodataModel');

exports.getBiodatas = async (req, res) => {
    try {
        const biodatas = await Biodata.find();

        res.status(200).json({
            status: 'success',
            data: {
                biodatas,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            status: 'fail',
            message: 'Data not found',
        });
    }
};

exports.getBiodata = async (req, res) => {
    try {
        const biodata = await Biodata.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                biodata,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            status: 'fail',
            message: 'Data not found',
        });
    }
};

exports.updateBiodata = async (req, res) => {
    try {
        const biodata = await Biodata.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                biodata,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            status: 'fail',
            message: 'Data not found',
        });
    }
};
