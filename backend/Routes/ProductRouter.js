const ensureAuthenticated = require('../Middlewares/Auth');
const router = require('express').Router();

router.get('/',ensureAuthenticated, (req, res) => {
    console.log('\n----logged in user details----\n',req.user); 
    res.status(200)
    .json([
        {
            name: 'Mobile',
            price: 10000,
        },
        {
            name: 'Laptop',
            price: 50000,
        },
        {
            name: 'Tablet',
            price: 30000,  
        }
    ]);
    });

module.exports = router;