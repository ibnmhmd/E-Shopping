'use strict';
const CRYPTO = require('crypto');
const ALGORITHM = 'aes-256-ctr';
var KEY_HEXA = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4"; 

const Encrypt = (password) => {
    
    try {
		let  iv = CRYPTO.randomBytes(16);
		let  data = new Buffer(password).toString('binary');
		let  key = new Buffer(KEY_HEXA, "hex");
		let  cipher = require('crypto').createCipheriv('aes-256-cbc', key, iv);
		let  nodev = process.version.match(/^v(\d+)\.(\d+)/);
		let encrypted;

		if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {
			encrypted = cipher.update(data, 'binary') + cipher.final('binary');
		} else {
			encrypted =  cipher.update(data, 'utf8', 'binary') +  cipher.final('binary');
		}
		var encoded = new Buffer(iv, 'binary').toString('hex') + new Buffer(encrypted, 'binary').toString('hex');

		return encoded;
	} catch (ex) {
	  console.error(ex);
	}
}

const Decrypt = (cypherText) => {

    let combined = new Buffer(cypherText, 'hex');		
	let key = new Buffer(KEY_HEXA, "hex");
    let iv = new Buffer(16);

	combined.copy(iv, 0, 0, 16);
    let edata = combined.slice(16).toString('binary');
    let decipher = CRYPTO.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false); 
	// UPDATE: crypto changed in v0.10
	// https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10 
	let nodev = process.version.match(/^v(\d+)\.(\d+)/);
	let decrypted, plaintext;
	if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {  
        decrypted = decipher.update(edata, 'binary') + decipher.final('binary');  
      
		plaintext = new Buffer(decrypted, 'binary').toString('utf8');
	} else {
		plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
	}
	return plaintext;
}

var crypto = require('crypto')
var algorithm = 'aes-128-cbc'
var key = 'AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
var iv =  'AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'

key=new Buffer(key,'hex')
iv=new Buffer(iv,'hex')
const Encrypto = (text) => {
	var cipher = crypto.createCipheriv(algorithm,key,iv)
	text=new Buffer(text)
	var crypted = cipher.update(text,'utf-8','base64')
	crypted += cipher.final('base64');
	return crypted;
}

const Decrypto = (text) => {
	var decipher = crypto.createDecipheriv(algorithm,key,iv)
    var dec = decipher.update(text,'base64','utf-8');
  dec += decipher.final();
  return dec;
}

module.exports = {
    Encrypt,
	Decrypt,
	Encrypto,
	Decrypto
}