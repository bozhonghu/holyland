var mongoose = require('mongoose'); //mongo connection

var stackerSchema = new mongoose.Schema({
    id: String,
    name: String,
    team: String,
    points: Number
});
mongoose.model('Stacker', stackerSchema);
