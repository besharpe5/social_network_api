const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addNewFriend,
    removeFriend
  } = require('../../controllers/user-controller');
  
  // this will be /api/users
  router
    .route('/')
    .get(getAllUsers)
    .post(createUser);
    
  
  // this will be /api/users/:id
  router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

  router
    .route('/:id/friends/:friendId')
    .post(addNewFriend)
    .delete(removeFriend)


module.exports = router;