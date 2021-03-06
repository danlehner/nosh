/* ===== REQUIRE. EXPRESS, ROUTER & DB ===== */
const router = require('express').Router();
const db =  require('../models');

// auth login required
const loginRequired = function(req, res, next) {
  if(!req.session.currentUser) {
      res.redirect('/login')
  }
  next();
}


// base path /
/* ===== REGISTER, LOGIN, LOGOUT USER ===== */
// --- ALL IN AUTH CONTROLLER ---
// --- user: username made in this route for auth.


// base path /users
/* ===== USER  ROUTES ===== */

router.get("/", loginRequired, (req, res) => {
  db.User.findById(req.session.currentUser.id)
  .populate("nosh")
  .exec(function (error, foundUser) {
    if(error) {
      console.log(error)
      return res.send(error)
    }
    const context = {
      user: foundUser
    }
    res.render(`user/index`, context);
  })
});

// GET (edit) USER INFO FOR UPDATE
router.get("/:id/edit", loginRequired, async (req, res) => {
  // res.render('user/edit');
  try {
  const foundUser = await db.User.findById(req.params.id);
  const context = { user: foundUser };
  res.render("user/edit", context); 
  } catch (error) {
    console.log(error);
    res.send( {message: "Something went horribly wrong [in your GET USERS/ID/EDIT route] please go back... in time"} );
  }
});

// PUT (update) USER INFO FOR UPDATE (USED 'UPDATEUSER' IF NOT IT CONFLICTS WITH TEH PANTRY ITEM ROUTE)
router.put("/:id/updateUser", loginRequired, async (req, res) => {
  try {
    // get the user from db
    const foundUser = await db.User.findByIdAndUpdate(req.session.currentUser.id, req.body, { new: true })
    res.redirect(`/users`)
  } catch (error) {
  console.log(error);
  res.send( {message: "Something went horribly wrong [in your PUT UpdateUser route] please go back... in time"} );
  }
});

// DELETE (user)
// TODO (this will need ot look thoough recipies too) similar to autHors and articles example
router.delete("/:id", (req, res) => {
  db.User.findByIdAndDelete(req.params.id, (error, deletedUser) => {
    if (error) {
      console.log(err);
      return res.send(err);
    }
    // console.log(deletedUser);
    res.redirect("/logout");
  });
});






/* === NOSH ONLY ROUTES === */
// PUT - NOSH IT ROUTE
router.put("/:id/nosh", loginRequired, async (req, res) => {
  try {
    // get the user from db
    const foundUser = await db.User.findByIdAndUpdate(req.session.currentUser.id, {$addToSet: { nosh: req.params.id }}, { new: true })
    // set current user.nosh equal to what hey just pressed
    req.session.currentUser.nosh = foundUser.nosh
    res.redirect(`/recipe/${req.params.id}`)
  } catch (error) {
  console.log(error);
  res.send( {message: "Something went horribly wrong [in your PUT NOSHIT route] please go back... in time"} );
  }
});

/// PUT NOSH OUT ROUTE
router.put("/:id/noshout", loginRequired, async (req, res) => {
  try {
    // get the user from db
    const foundUser = await db.User.findByIdAndUpdate(req.session.currentUser.id, {$pull: { nosh: req.params.id }}, { new: true })
    //set current user.nosh equal to what hey just pressesd
    req.session.currentUser.nosh = foundUser.nosh
    res.redirect(`/recipe/${req.params.id}`)
  } catch (error) {
  console.log(error);
  res.send( {message: "Something went horribly wrong [in your PUT NOSHOUT route] please go back... in time"} );
  }
});






/* === PANTRY ROUTES === */
// GET (show) USER PANTRY FROM NAVBAR
router.get("/pantry", loginRequired, (req, res) => {
  db.User.findById(req.session.currentUser.id, (error, foundUser) => {
    if(error) {
      console.log(error);
      return res.send(error)
    }
    const context = { user: foundUser }
    res.render(`user/show`, context);
  })
});

// GET (show) USER PANTRY AND FORM TO INPUT NEW PANTRY ITEMS
router.get("/:id", loginRequired, (req, res) => {
    db.User.findById(req.params.id, (err, foundUser) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { user: foundUser };
      res.render("user/show", context);
    });
});

// PUT  (update) PANTRY FOOD ITEM
router.put("/:id", loginRequired, async (req, res) => {
  try {
    const updatedItem = {
      $push: {pantry: {
              foodItem: req.body.foodItem,
              quantity: req.body.quantity,
              unit: req.body.unit,
      }},
    };
    const updatedPantry = await db.User.findByIdAndUpdate(req.params.id, updatedItem, { new: true });
    res.redirect(`/users/${req.params.id}`)
  } catch (error) {
    console.log(error);
    res.send( {message: "Something went horribly wrong [in your PUT Pantry route] please go back... in time"} );
  }
}); 

// GET (edit) FOODITEM UPDATE FORM PANTRY
router.get("/:id/editItem", loginRequired, (req, res) => {
  // res.send("fooditem ping back!)"
  db.User.findById(req.session.currentUser.id,  (err, foundUser) => {
    if (err) {
    console.log(error)
    return res.send(err);
    }
    // this grabs the user above and the we narrow down in the code below to get the pantry item by id
    const context = { item: foundUser.pantry.id(req.params.id) };
    // console.log(context);
    res.render("user/editItem", context );
  });
});  

// PUT (updateItem) FOODITEM FROM UPDATEITEM FORM TO DB AND BACK TO USER
router.put("/:id/updateItem", loginRequired, async (req, res) => {
    try {
      // get the user from db
      const foundUser = await db.User.findById(req.session.currentUser.id)
      
      // get the user.pantry{foodites,qty,unit}
      let item = foundUser.pantry.id(req.params.id)
      
      // update items from db (left) to items from form (right)
      item.foodItem = req.body.foodItem;
      item.quantity = req.body.quantity;
      item.unit = req.body.unit;
      
      // just await then save the user
      await foundUser.save();

      // construct user context to send back to page
      const context = { user: foundUser }
      res.render(`user/show`, context);
    } catch (error) {
      console.log(error);
      res.send( {message: "Something went horribly wrong [in your PUT Food Item route] please go back... in time"} );
    }
});

// DELETE (PANTRY ITEM)
router.delete("/:id/updateItem", loginRequired, async (req, res) => {
  try {
    // get the user from db
    const foundUser = await db.User.findById(req.session.currentUser.id)

    // get the user.pantry{foodites,qty,unit} and just dot remove & then save
    let item = foundUser.pantry.id(req.params.id);
    item.remove();
    await foundUser.save();

    // construct user context to send back to page
    const context = { user: foundUser }
    res.render(`user/show`, context);
  } catch (error) {
    console.log(error);
    res.send( {message: "Something went horribly wrong [in your DELETE FOOD Item route] please go back... in time"} );
  }
}); 



/* === USER ROUTES TODO === */
/* TODO user owned recipies */
// TODO calculate how many usres have saved a recipie, recipe.savers.length



module.exports = router;