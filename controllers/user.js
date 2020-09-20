/* ===== REQUIRE. EXPRESS, ROUTER & DB ===== */
const router = require('express').Router();
const db =  require('../models');
const bcrypt = require('bcrypt');

// base psth /



/* ===== do first ===== */
/* ===== REGISTER, LOGIN, LOGOUT USER ===== */
// get register form
router.get('/register', (req, res) => {
    res.render("get a register ping back")
})

// post register info
router.post('/register', (req, res) => {
    res.render("post a register ping back")
})
// get login form
router.get('/login', (req, res) => {
    res.render(" get a login ping back")
})
// post login info <== authentication
router.post('/login', (req, res) => {
    res.render("post a login ping back")
})
// delete, logout <= thsi destroys teh session
router.get('/logout', (req, res) => {
    res.render("get a logout ping back")
})


/* ===== do third ===== */
/* ===== USER NOSH ===== */
// get index 
        //once user selects (save) it executes post below
// post recipe to user nosh 
        //(when items in nosh for user, show (unsave) on save button in index & show page)
// get index
        //(if in nosh, the delete form nsoh and show button as (save))
// delete recipe from nosh





/* ===== do second ===== */
/* ===== USER PANTRY ===== */
// index
// get new pantry form
// post new pantry info
// show user with recipes references (saved) similar to authors showing articles tehy are associated with, user populte recipes
// get (edit)  pantry info
// put (update) pantry info
// delete user (this will need ot look thoough recipies too) similar to autors and articles example removes from user & recipe






/* ===== do fourth ===== */
/* ===== USER RECIPE ===== */
// simialr to nosh above

module.exports = router;