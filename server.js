/**
 * Created by jpegz on 2/15/17.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Luxafor = require('luxafor-api');
const device = new Luxafor({
    defaults: {
        wave: {
            type: 2,
            speed: 90,
            repeat: 5
        },
        setColor: {},
        flash: {},
        fadeTo: {},
        off: {}
    }
});
device.setColor('#FFF');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 9001;

const router = express.Router();
router.route('/luxafor')
    .post((req, res) => {
        const {action, color, speed, repeat, target, type} = req.body;

        var status;
        switch (action) {
            case "setColor":
                status = setColor(color, target);
                break;
            case "fadeTo":
                status = fadeTo(color, target, speed);
                break;
            case "flash":
                status = flash(color, speed, repeat);
                break;
            case "wave":
                status = wave(color, type, speed, repeat);
                break;
            case "off":
                status = off();
                break;
        }

        if (status) {
            if (status.message) {
                res.json({status: status.message});
            }
            res.json({status: "success"});
        } else {
            res.json({status: "action not supported"});
        }

    });

function setColor(color, target) {
    device.setColor(color, target);
}

function fadeTo(color, target, speed = 20) {
    device.fadeTo(color, target, speed);
}

function flash(color, speed = 180, repeat = 5) {
    device.flash(color, speed, repeat);
}

function wave(color, type = 2, speed = 90, repeat = 5) {
    device.wave(color, type, speed, repeat);
}

function off() {
    device.off();
}

app.use('/api', router);
app.listen(port);
console.log('Luxafor listening on port ' + port);