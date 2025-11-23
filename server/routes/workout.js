let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Workout = require('../models/workout')
function requireAuth(req,res,next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login')
    }
    next();
}
//get --> Extract and read something
// post --> post something
// put --> edit/update some data
//delete --> delete the data

//CRUD --> CREATE READ UPDATE DELETE

//Get route for the read workoutlist - Read Operation
router.get('/', async (req, res, next) => {
    try {
        const WorkoutList = await Workout.find();
        //console.log(WorkoutList);
        res.render('Workouts/list', {
            title: 'Workouts',
            WorkoutList: WorkoutList,
            displayName: req.user ? req.user.displayName : ""
        })
    }
    catch (err) {
        console.error(err);
        res.render('Workouts/list', {
            error: 'Error on server',
            displayName: req.user ? req.user.displayName : ""
        })
    }
});

//Get route for the displaying the Add Page - Create Operation
router.get('/add', async (req, res, next) => {
    try {
        res.render('Workouts/add', {
            title: 'Add a Workout',
            displayName: req.user ? req.user.displayName : ""
        })
    }
    catch (err) {
        console.error(err);
        res.render('Workouts/add', {
            error: 'Error on server',
            displayName: req.user ? req.user.displayName : ""
        })
    }
});

//Post route for the processing the Add Page - Create Operation
router.post('/add', async (req, res, next) => {
    try{
        let newWorkout = Workout({
            "exercise":req.body.exercise,
            "muscleGroup":req.body.muscleGroup,
            "sets":req.body.sets,
            "reps":req.body.reps,
            "weight":req.body.weight
        })
        Workout.create(newWorkout).then(()=>{
            res.redirect('/workouts')
        })
    }
    catch (err) {
        console.error(err);
        res.render('Workouts/add', {
            error: 'Error on server',
            displayName: req.user ? req.user.displayName : ""
        })
    }
});

//Get route for the displaying the Edit Page - Update Operation
router.get('/edit/:id', async (req, res, next) => {
    try{
        const id = req.params.id;
        const workoutToEdit = await Workout.findById(id);
        res.render("Workouts/edit",
            {
                title:'Edit Workout',
                Workout: workoutToEdit,
                displayName: req.user ? req.user.displayName : ""
            }
        )
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

//Post route for the processing the Edit Page - Update Operation
router.post('/edit/:id', async (req, res, next) => {
    try{
        let id = req.params.id;
        let updateWorkout = Workout({
            "_id":id,
            "exercise":req.body.exercise,
            "muscleGroup":req.body.muscleGroup,
            "sets":req.body.sets,
            "reps":req.body.reps,
            "weight":req.body.weight
        })
        Workout.findByIdAndUpdate(id,updateWorkout).then(()=>{
            res.redirect('/workouts')
        })
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

//Get route for the delete operatation- Delete Operation
router.get('/delete/:id', async (req, res, next) => {
    try{
        let id = req.params.id;
        Workout.deleteOne({_id:id}).then(()=>{
            res.redirect("/workouts")
        })
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})

module.exports = router;