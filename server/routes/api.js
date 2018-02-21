
const PasswordModule = require('../../src/AES.passwordEncrypter.Decrypter');
const MONGO_CONFIG = require('../../mongodb.config');
const express = require('express');
const router = express.Router();

//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
mongoose.Promise =global.Promise;
const Schema = mongoose.Schema;
const usersSchema = new Schema({userName: String, email: String, password: String, token: String});
const cartSchema = new Schema({token: String, cart: {type: Array, 'default': []}});
const model = mongoose.model('users', usersSchema);
const cartModel = mongoose.model('cart', cartSchema);
const orderHistoryModel = mongoose.model('orderHistory', cartSchema);

//************* Connect *****************
const connection = (closure) => {
    return mongoose.connect(''+MONGO_CONFIG.MONGO_CONNECTION_STRING +'/'+ MONGO_CONFIG.MONGO_DB+'', { useMongoClient: true }, (err, db) => {
        if (err) return console.log('error connecting to mongodb log is --->', err);

        closure(db);
    });
};

//*************** Error handling ********
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

//*********** Response handling **********
let response = {
    status: 200,
    data: [],
    count: 0,
    message: null
};

// ************** create users ***********
router.post('/createUser', (req, res) => {
    /*************prepare user data ******/
    let encPassword = PasswordModule.Encrypto(PasswordModule.Encrypto(req.body.password));
    const newUser = new model({userName: req.body.name ,email: req.body.email, password: encPassword, token: req.body.user_token})

   /*************insert into db **********/
    connection((db) => {
        newUser.save()
            .then((user) => {
                response.message = 'user created';
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
   /************************* ends **********/

 /************************** get user by email **********/
router.get('/getUserByEmail', (req, resp) => {
       /*************get all registered users from db *****************/
       connection((db) => {
        const email = req.query.email;
        const query = {'email': email};
        model.find(query)
            .then((user) => {
                response.message = 'user by email fetched';
                response.count = user.length;
                resp.json(response);
            })
            .catch((err) => {
                sendError(err, resp);
            });
    });
});
 /************************* ends **********/

 /***************** validate password ******/
 router.post('/validatePassword', (req, resp) => {
     console.log('posted')
   /*************get all registered users from db *****************/
   connection((db) => {
    const email = req.body.email, password = req.body.password;
    let decryptedPass = '';
    const query = {'email': email};
    model.find(query)
        .then((user) => {
            if(user.length > 0) {
                decryptedPass = PasswordModule.Decrypto(PasswordModule.Decrypto(user[0].password));
                decryptedPass = decryptedPass.replace(/\s/g,'');
                if(decryptedPass === password) {
                    let userData = [{
                         'name':  user[0].userName,
                         'email': user[0].email,
                         'token': user[0].token
                    }];
                    response.message = 'password matched';
                    response.data = userData;
                    response.count = user.length;
                }else {
                    updateResponse();
                }
            }else {
                updateResponse();
            }
            resp.json(response);
        })
        .catch((err) => {
            sendError(err, resp);
        });
});
});
/*************** ends *****************/

/************** post user's item***********/
router.post('/postItem', (req, res) => {
    /*************prepare user data ******/
    let itemObject = {};
    if(req.body.item) {
        itemObject = JSON.parse(req.body.item);
    }
    const newItem = new cartModel({token: req.body.token , cart: itemObject})

   /*************insert into db **********/
    connection((db) => {
        newItem.save()
            .then((cart) => {
                response.message = 'item posted';
                response.status = 200;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
   /************************* ends **********/
 
 /************************** get user cart **********/
 router.get('/getUserCart', (req, resp) => {
    connection((db) => {
        var token = '';
        if(req.query.token ) {
            token = req.query.token;  
        }
     const query = {'token': token}, where = {'cart': 1};

     cartModel.find(query, where)
         .then((cart) => {
             response.message = 'cart fetched';
             response.count = cart.length;
             response.data = cart;
             resp.json(response);
         })
         .catch((err) => {
             sendError(err, resp);
         });
 });
});
/************************* ends **********/

 /************************** update user cart **********/
 router.put('/expandUserCart', (req, resp) => {
    connection((db) => {
        var token = '', item;
        if(req.body.token ) {
            token = req.body.token;  
        }
        if(req.body.item) {
            item =JSON.parse(req.body.item);
        }
     const query = {'token': token}, where = { $push: { 'cart':item }};
     cartModel.update(query, where)
         .then((cart) => {
             response.message = 'cart expanded';
             response.count = cart.length;
             response.data = cart;
             resp.json(response);
         })
         .catch((err) => {
             sendError(err, resp);
         });
 });
});
/************************* ends **********/

 /************************** update user cart **********/
 router.put('/updateUserCart', (req, resp) => {
    connection((db) => {
        var token = '', item;
        if(req.body.token ) {
            token = req.body.token;  
        }
        if(req.body.item) {
            item =JSON.parse(req.body.item);
        }
     const query = {'token': token}, where = { $set: { 'cart': item }};
     cartModel.update(query, where)
         .then((cart) => {
             response.message = 'cart updated';
             response.count = cart.length;
             response.data = cart;
             resp.json(response);
         })
         .catch((err) => {
             sendError(err, resp);
         });
 });
});
/************************* ends **********/


/************** post user's item***********/
router.post('/postItemInHistory', (req, res) => {
    /*************prepare user data ******/
    let itemObject ;
    if(req.body.item) {
        itemObject = JSON.parse(req.body.item);
    }
    const newItem = new orderHistoryModel({token: req.body.token , cart: itemObject})

   /*************insert into db **********/
    connection((db) => {
        newItem.save()
            .then((cart) => {
                response.message = 'item posted';
                response.status = 200;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
   /************************* ends **********/
 
 /************************** get user cart **********/
 router.get('/getUserOrderHistory', (req, resp) => {
    connection((db) => {
        var token = '';
        if(req.query.token ) {
            token = req.query.token;  
        }
     const query = {'token': token}, where = {'cart': 1};

     orderHistoryModel.find(query, where)
         .then((cart) => {
             response.message = 'cart fetched';
             response.count = cart.length;
             response.data = cart;
             resp.json(response);
         })
         .catch((err) => {
             sendError(err, resp);
         });
 });
});
/************************* ends **********/

 /************************** update user cart **********/
 router.put('/expandUserOrderHistory', (req, resp) => {
    connection((db) => {
        var token = '', item;
        if(req.body.token ) {
            token = req.body.token;  
        }
        if(req.body.item) {
            item =JSON.parse(req.body.item);
        }
     const query = {'token': token}, where = { $set: { 'cart':item }};
     orderHistoryModel.update(query, where)
         .then((cart) => {
             response.message = 'cart expanded';
             response.count = cart.length;
             response.data = cart;
             resp.json(response);
         })
         .catch((err) => {
             sendError(err, resp);
         });
 });
});
/************************* ends **********/

/************** set response **********/
function updateResponse() {
    response.message = 'password mismatched';
    response.data = [];
    response.count = 0;
}
/******************* ends *************/
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connection to mongo is successful !');
});
db.on('error', (err) => {
    console.log('Error connecting to mongodb', err)
})
module.exports = router;