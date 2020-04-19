getUserData = (object) => {
    let data = {};
    if (object) {
      data = JSON.parse(object);
    }
    return data;
}

isRegisteredUser = (data) => {
    if (data) {
        if ('guest' === data.mode) {
          return false;
        }else
            if ('registered' === data.mode) {
              return true;
          }
        }
    return false;
}

getCurrentUserByEmail = (email) => {
    if(localStorage.getItem('users')) {
        const users = JSON.parse(localStorage.getItem('users'));
        const currentUser = users.find(user => user.email === email);
        return currentUser ;
    }
}
getAllRegisteredUsers = (object) =>{
    if(object) {
        const users = JSON.parse(object);
        return users;
    }
}

cleanUserCart= (data, fetchedData) => {
    let items ;
    if(data) {
      items = data.filter(_obj => _obj.guid !== fetchedData.guid);
      if(undefined !== items) {
        return items;
      }
    }  
}

isItemPresent = (data, fetchedData) => {
    let result , present = true;
    if(data) {
       result = data.find(_obj => _obj.guid === fetchedData.guid);
       if(undefined !== result){
         return present;
       }else 
       {
         return !present ;
       }
    }
  }

calculateVAT= (cost) => {
    const VAT = .05;
    return cost*VAT;
}

isAdmin = () => {
        const data = getUserData();
       if(data) {
         if(data.session === 'loggedIn' && data.mode === 'registered'
         && data.email === 'amine.admin@mail.com') {
            return true ;
         }else {
             return false;
         }
       } 
}
module.exports =
{
    getUserData ,
    isRegisteredUser,
    getCurrentUserByEmail,
    getAllRegisteredUsers,
    calculateVAT,
    cleanUserCart,
    isItemPresent,
    isAdmin
}