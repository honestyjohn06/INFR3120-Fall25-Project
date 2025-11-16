let mongoose = require("mongoose");

// Create a model

let workoutModel = mongoose.Schema(
    {
    exercise: String,
    muscleGroup: String,
    sets: Number,
    reps: Number,
    weight: String,
    },
    {
        collection:"WorkoutTracker"
    }
);
module.exports=mongoose.model('WorkoutTracker',workoutModel)