var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (parseInt(req.body.guess_num, 10) % 5 == 0 && req.body.flag == null)
            res.render('puzzle/hint', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', {old_guess_num: req.body.guess_num});
    });
router.route('/hint')
    .post(function(req, res) {
        res.render('puzzle/hint', {old_guess_num: req.body.guess_num});
    });
router.route('/hinta')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null)
            res.render('puzzle/hinta', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/hintb')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null)
            res.render('puzzle/hintb', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/hintp')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null)
            res.render('puzzle/hintp', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/hintj')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null)
            res.render('puzzle/hintj', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
    router.route('/hints')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null)
            res.render('puzzle/hints', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/wrong')
    .post(function(req, res) {
        res.render('puzzle/wrong', {old_guess_num: parseInt(req.body.guess_num, 10) + 1});
    });
router.route('/reallyWrong')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null)
            res.render('puzzle/reallyWrong', {old_guess_num: req.body.guess_num});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/guessB')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null && req.body.guess.toLowerCase() == 'jeongyeon with long hair')
            res.render('puzzle/reallyWrong', {old_guess_num: req.body.guess_num});
        else if (req.body.password != null)
            res.render('puzzle/wrong', {old_guess_num: parseInt(req.body.guess_num, 10) + 1});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/guessP')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null && req.body.guess.toLowerCase() == 'kawhi leonard')
            res.render('puzzle/reallyWrong', {old_guess_num: req.body.guess_num});
        else if (req.body.password != null)
            res.render('puzzle/wrong', {old_guess_num: parseInt(req.body.guess_num, 10) + 1});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/guessS')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null && req.body.guess.toLowerCase() == 'red')
            res.render('puzzle/reallyWrong', {old_guess_num: req.body.guess_num});
        else if (req.body.password != null)
            res.render('puzzle/wrong', {old_guess_num: parseInt(req.body.guess_num, 10) + 1});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });
router.route('/guessJ')
    .get(function(req, res, next) {
        res.render('puzzle/index', { old_guess_num: 1 });
    })
    .post(function(req, res) {
        if (req.body.password != null && req.body.guess.toLowerCase() == 'tf2')
            res.render('puzzle/reallyWrong', {old_guess_num: req.body.guess_num});
        else if (req.body.password != null)
            res.render('puzzle/wrong', {old_guess_num: parseInt(req.body.guess_num, 10) + 1});
        else 
            res.render('puzzle/index', { old_guess_num: 1 });
    });

module.exports = router;