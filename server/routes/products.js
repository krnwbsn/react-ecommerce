var express = require('express');
var router = express.Router();
var path = require('path');
const Product = require('../models/product')

/* GET home page. */
router.get('/:limit/:page', (req, res, next) => {
    let limit = parseInt(req.params.limit) || 4;
    let numOfSkipPage = ((parseInt(req.params.page) - 1) * limit) || 0;
    Product.find()
        .skip(numOfSkipPage)
        .limit(limit)
        .exec((err, response) => {
            if (err) {
                console.log(err);
                res.status(400).json({'error': err})
            } else {
                res.status(200).json(response);
            }
        })    
});

router.get('/:idproduct', (req, res, next) => {
    let idproduct = req.params.idproduct;
    Product.find({_id: idproduct})
        .exec((err, response) => {
            if (err) {
                console.log(err);
                res.status(400).json({status: 'failed', error: err})
            } else {
                res.status(200).json({status: 'success', data: response[0]})
            }
        })
})

router.put(':/idproduct/:vote', (req, res, next) => {
    let idproduct = req.params.idproduct;
    let vote = parseInt(req.params.vote);
    Product.find({_id: idproduct})
        .exec((err, response) => {
            let arrayVote = response[0].rate;
            arrayVote.push(vote);
            if (err) {
                console.log(err);
                res.status(400).json({status: 'failed', error: err});
            } else {
                Product.findOneAndUpdate({_id: idproduct}, {rate: arrayVote}, (err, response) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({status: 'failed, error: err'});
                    } else {
                        res.status(201).json({status: 'success', data: response});
                    }
                })
            }
        })
})

router.post('/', (req, res, next) => {
    let {title, description, price, brand, detailproduct} = req.body;
    let rate = parseInt(req.body.rate);
    try {
        let arrayRate = [rate];
        const newProduct = new Product({title, rate: arrayRate, description, price, brand, detailproduct});
        newProduct.save().then(dataCreated => {
            res.status(201).json({status: 'success', data: dataCreated})
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({status: 'failed', err});
    }
})

router.delete('/:idproduct', (req, res, next) => {
    let idproduct = req.params.idproduct;
    Product.findOneAndDelete({_id: idproduct}, (err, response) => {
        if (err) {
            console.log(err);
            res.status(400).json({status: 'failed', error: err});
        } else {
            res.status(201).json({status: 'success', data: response});
        }
    })
})

router.put('/upload/:idproduct', (req, res, next) => {
    let idproduct = req.params.idproduct;
    let uploadedfile = req.files ? req.files.files : null;
    let filename = req.files ? (Date.now() + '_' + req.files.files.name) : null;
    if (uploadedfile) {
        uploadedfile.mv(path.join(__dirnmae, `../../client/public/image/${filename}`), (err) => {
            if (err) {
                console.log(err);
                res.status(400).json({status: 'failed', error: err})
            } else {
                Product.findOneAndUpdate({_id: idproduct}, {imageproduct: filename}, (err, response) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ status: 'failed', error: err});
                    } else {
                        res.status(201).json({status: 'success', data: response})
                    }
                })
            }
        })
    } else {
        res.status(400).json({ status: 'failed', error: 'file not uploaded' })
    }
})

module.exports = router;
