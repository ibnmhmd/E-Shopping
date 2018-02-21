const usersModule = require('./manage-users-cart');

addItemToCustomerCart = (fetchedData, selectedQty) => {
    const data = usersModule.getUserData();
    const users = usersModule.getAllRegisteredUsers() ;
    let currentUser ;
/*********** extract the old values in the storage and append the new ones  ****/
let _extract_data = [];
if (!usersModule.isRegisteredUser()) {
  _extract_data = data.guest_cart ;
  _extract_data = _extract_data.filter (object => object.guid !== fetchedData.guid );

}else {
     currentUser = usersModule.getCurrentUserByEmail( data.email );
     _extract_data = currentUser.items_in_cart ;
     _extract_data = _extract_data.filter (object => object.guid !== fetchedData.guid );
}
 fetchedData['quantity'] = selectedQty;
 /********** set new value **********/
 if ( _extract_data === null) {
   _extract_data = [];
 }
 _extract_data.push(fetchedData );
 /************* new value ends ******/

/******************* guest user *******/
if (!usersModule.isRegisteredUser()) {
 data.guest_cart = _extract_data ;
 localStorage.setItem('guest_cart', JSON.stringify(_extract_data ));
 localStorage.setItem('user_data', JSON.stringify(data));
}else
  /*************** customer user*****/
if (usersModule.isRegisteredUser()) {
  /*********** add items to cart *****/
  currentUser.items_in_cart = _extract_data ;
  /******* replace customer object ******/
  const fresh_users = users.filter((user) => user.email !== data.email);
  fresh_users.push(currentUser);
  localStorage.setItem('users', JSON.stringify(fresh_users));
}
    
}

module.exports = {
    addItemToCustomerCart
}