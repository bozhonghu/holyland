var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

//build the REST operations at the base for Stackers
//this will be accessible from http://127.0.0.1:3000/stackers if the default route for / is left unchanged
router.route('/')
    //GET all stackers
    .get(function (req, res, next) {
        //retrieve all stackers from Monogo
        mongoose.model('Stacker').find({}, function (err, stackers) {
            if (err) {
                return console.error(err);
            } else {
                stackers.sort((a, b) => (a.team > b.team) ? 1 : -1)
                res.format({
                    //HTML response will render the index.jade file in the views/Stackers folder. We are also setting "Stackers" to be an accessible variable in our jade view
                    html: function () {
                        res.render('stackers/index', {
                            title: 'Holy Land Headquarters',
                            "stackers": stackers
                        });
                    },
                    //JSON response will show all Stackers in JSON format
                    json: function () {
                        res.json(stackers);
                    }
                });
            }
        });
    })
    //POST a new Stacker
    .post(function (req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var id = req.body.id;
        var name = req.body.name;
        var team = req.body.team;
        var points = req.body.points;

        //call the create function for our database
        mongoose.model('Stacker').create({
            id: id,
            name: name,
            team: team,
            points: points
        }, function (err, Stacker) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Stacker has been created
                console.log('POST creating new Stacker: ' + Stacker);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function () {
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("Stackers");
                        // And forward to success page
                        res.redirect("/Stackers");
                    },
                    //JSON response will show the newly created Stacker
                    json: function () {
                        res.json(Stacker);
                    }
                });
            }
        })
    });

/* GET New Stacker page. */
router.get('/new', function (req, res) {
    res.render('stackers/new', { title: 'Add New Stacker' });
});

/* TESTING QR page. */
router.get('/qr', function (req, res) {
    res.render('stackers/showQR', { title: 'QR Page' });
});

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Stacker').findById(id, function (err, stacker) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function () {
                    next(err);
                },
                json: function () {
                    res.json({ message: err.status + ' ' + err });
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(stacker);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

// Get by id
router.route('/:id')
    .get(function (req, res) {
        mongoose.model('Stacker').findById(req.id, function (err, stacker) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + stacker._id);
                var stacker_points = stacker.points;
                res.format({
                    html: function () {
                        res.render('stackers/show', {
                            "points": stacker_points,
                            "stacker": stacker
                        });
                    },
                    json: function () {
                        res.json(stacker);
                    }
                });
            }
        });
    });

//GET the individual stacker by Mongo ID
router.get('/:id/edit', function (req, res) {
    //search for the stacker within Mongo
    mongoose.model('Stacker').findById(req.id, function (err, stacker) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the stacker
            console.log('GET Retrieving ID: ' + stacker._id);
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function () {
                    res.render('stackers/edit', {
                        title: 'Stacker' + stacker._id,
                        "stacker": stacker
                    });
                },
                //JSON response will return the JSON output
                json: function () {
                    res.json(stacker);
                }
            });
        }
    });
});

//GET page for only editting points
router.get('/:id/editPoints', function (req, res) {
    //search for the stacker within Mongo
    mongoose.model('Stacker').findById(req.id, function (err, stacker) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the stacker
            console.log('GET Retrieving ID: ' + stacker._id);
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function () {
                    res.render('stackers/editPoints', {
                        title: 'Stacker' + stacker._id,
                        "stacker": stacker
                    });
                },
                //JSON response will return the JSON output
                json: function () {
                    res.json(stacker);
                }
            });
        }
    });
});

//PUT to update points
router.put('/:id/editPoints', function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var plus_points = parseInt(req.body.plus_points, 10);
    var minus_points = parseInt(req.body.minus_points, 10);
    var password = req.body.password;

    //find the document by ID
    mongoose.model('Stacker').findById(req.id, function (err, stacker) {
        if (password != "milfsquad") {
            res.format({
                html: function () {
                    res.redirect("/stackers/" + stacker._id + "/editPoints");
                }
            });
        } else {
            //update it
            console.log(stacker.points);
            stacker.update({
                points: stacker.points + plus_points - minus_points
            }, function (err, stackerID) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                }
                else {

                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.format({
                        html: function () {
                            res.redirect("/stackers/");
                        },
                        //JSON responds showing the updated values
                        json: function () {
                            res.json(stacker);
                        }
                    });
                }
            })
        }
    });
});

//GET page for editing team
router.get('/tools/editTeam', function (req, res) {
    //retrieve all stackers from Monogo
    mongoose.model('Stacker').find({}, function (err, stackers) {
        if (err) {
            return console.error(err);
        } else {
            //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
            var teams = stackers.map(s => s.team);
            var uniqueTeams = Array.from(new Set(teams))

            res.format({
                //HTML response will render the index.jade file in the views/Stackers folder. We are also setting "Stackers" to be an accessible variable in our jade view
                html: function () {
                    res.render('stackers/editTeam', {
                        title: 'Edit Team Points',
                        "stackers": stackers,
                        'allTeams': uniqueTeams
                    });
                },
                //JSON response will show all Stackers in JSON format
                json: function () {
                    res.json(stackers);
                }
            });
        }
    });
});

//PUT to update a whole team 
router.put('/tools/editTeam', function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var team = req.body.team;
    var plus_points = parseInt(req.body.plus_points, 10);
    var minus_points = parseInt(req.body.minus_points, 10);
    var password = req.body.goat;

    if (password != "milfsquad") {
        res.format({
            html: function () {
                res.redirect("/stackers/");
            }
        });
    } else {
        //find the documents by team
        mongoose.model('Stacker').updateMany({ team: team }, { $inc: { points: plus_points - minus_points } }, function (err, updated_team) {
            //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
            res.format({
                html: function () {
                    res.redirect("/stackers/");
                },
                //JSON responds showing the updated values
                json: function () {
                    res.json(stacker);
                }
            });
        });
    }
});

//PUT to update a blob by ID
router.put('/:id/edit', function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var team = req.body.team;
    var points = req.body.points;

    //find the document by ID
    mongoose.model('Stacker').findById(req.id, function (err, stacker) {
        //update it
        stacker.update({
            name: name,
            team: team,
            points: points
        }, function (err, stackerID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function () {
                        res.redirect("/stackers/" + stacker._id);
                    },
                    //JSON responds showing the updated values
                    json: function () {
                        res.json(stacker);
                    }
                });
            }
        })
    });
});

//DELETE a Blob by ID
router.delete('/:id/edit', function (req, res) {
    //find blob by ID
    mongoose.model('Stacker').findById(req.id, function (err, stacker) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            stacker.remove(function (err, stacker) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + stacker._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function () {
                            res.redirect("/stackers");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function () {
                            res.json({
                                message: 'deleted',
                                item: stacker
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
