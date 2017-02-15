/**
 * Created by jpegz on 2/15/17.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// api documentation for luxafor: https://www.npmjs.com/package/luxafor-api
const Luxafor = require('luxafor-api');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 9001;

const router = express.Router();
router.route('/luxafor')
    .post((req, res) => {
        const luxafor = new Luxafor();
        const {action, color, speed, repeat, target, type} = req.body;

        var status;
        switch (action) {
            case "setColor":
                status = luxafor.setColor(color, target);
                break;
            case "fadeTo":
                status = luxafor.fadeTo(color, target, speed);
                break;
            case "flash":
                status = luxafor.flash(color, speed, repeat);
                break;
            case "wave":
                status = luxafor.wave(color, type, speed, repeat);
                break;
            case "off":
                status = luxafor.off();
                break;
        }
        luxafor.device.close();

        if (status) {
            if (status.message) {
                res.json({status: status.message});
            } else {
                res.json({status: "success"});
            }
        } else {
            res.json({status: "action not supported"});
        }

    });

app.use('/api', router);
app.listen(port);
console.log('Luxafor listening on port ' + port);
