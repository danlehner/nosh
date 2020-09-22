const mongoose = require("mongoose");


// Schema("template", optional configuration obj)
const recipeSchema = new mongoose.Schema({
    recipeName: {type: String, required: true},
        // quantity value should be set to 1, unit value should be set to foodItems.name+"s"
    foodItems: [
        {
            foodName: {type: String, required: true},
            quantity: {type: Number, required: true},
            unit: {type: String, required: true},
            calories: {type: Number, required: true},
        },
    ],
        //narrative Description are the recipe's exact instructions, NOT owner's thoughts about dish which will be at tag.text
    narrativeDescription: {type: String, required: false},
        // if outside source exists provide it, if source does not exist not required
    imageSource: {type: String, required: false},
        // serving size per recipe
    servesPeople: {type: Number, required: true},
        // must provide numHours, hours is already filled in NO Option to choose,
        // must provide numMinutes, minutes is already filled in NO Option to choose,
    cookTime: [
        // {numMinutes: {type: String, required: true}},
        {numHours: {type: Number, required: true}},
        {numMinutes: {type: Number, required: true}},
    ],
        // restrict to available options ("beginner","intermediate", "expert" )
    skillLevel: {type: String, required: false},
    //     // totalCalories is a function that sums foodItem.calories
    //     // DON'T PUT totalCALORIES IN FORM
    totalCalories: {type: Number, required: false},
    //     // each recipe should have a tag per foodItem, 
    tag: [
        {  //add a minimum requirement of 3 tags
            tagName: {type:String, required: true},
            count: {type: Number, required: false},
            saverDescription: {type: String, required: false},
        },
    ],

    //     // on save2Nosh recipe.savers = user._id    
    // savers: [{
    //     // reference
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //         // this will not count the number of users associated with this recipe
    // },],
    //     // the creator the recipe is the owner, the user._id is the value
    //     // owner gets transferred to Team-Nosh-Admin-User when owner deletes recipe
    //         // on create/post recipe.owner = user._id
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
})

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;

