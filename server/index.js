const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const JWT_SECRET = "dhdhd41241dadsadadasfesdr1324324rwfsdvfbgmj,.kqwwerqrqrwefdfgerrew"

const trainingModel = require('./models/training');
const exercisesModel = require('./models/exercises');
const userModel = require('./models/register');
const Training = require('./models/training');
const Exercise = require('./models/exercises');
const User = require('./models/register');





const cors = require('cors');
const router = express.Router();
app.use('/', router);
module.exports = router;


app.use(express.json());
app.use(cors());


mongoose.connect(
  "mongodb+srv://piotrus:piotrus2703@cluster0.jomhd6h.mongodb.net/trainingapp?retryWrites=true&w=majority"
);


/////////////////////////////////POZYSKAJ TRENINGI//////////////////////////////////

app.get("/getTraining", (req, res) => {
  trainingModel.find({})
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});


/////////////////////////////////STWORZ TRENING///////////////////////////////////

app.post("/createTraining", async (req, res) => {
  try {
    const training = req.body;
    const newTraining = new trainingModel(training);
    await newTraining.save();
    console.log('New training created with ID:', newTraining._id);
    res.json(newTraining);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

/////////////////////////////////POZYSKAJ CWICZENIA Z KOLEKCJI EXERCISES///////////////////////////////////

app.get("/getExercises", (req, res) => {
  exercisesModel.find({})
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

/////////////////////////////////EDYTOWNIE TRENINGU W KOLEKCJI WORKOUTS///////////////////////////////////


// PUT /updateTraining/:userId/:trainingId
app.put('/updateTraining/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTraining = req.body;

  try {
    const response = await Training.findByIdAndUpdate(id, updatedTraining, { new: true });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while updating the training." });
  }
});


/////////////////////////////////USUWANIE TRENINGU Z KOLEKCJI WORKOUTS//////////////////////////////////


app.delete('/deleteTraining/:id', async (req, res) => {
  const trainingId = req.params.id;
  try {
    // delete training from the database
    await Training.findByIdAndDelete(trainingId);

    res.status(200).send("Training deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the training.");
  }
});




///////////////////////////////////////////////////////DODAJ CWICZENIE DO TRENINGU/////////////////////





/////////////////////////////////REJESTRACJA NOWEGO USERA///////////////////////////////////
app.post("/createUser", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ error: "User exists!" });
    }
    await User.create({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.send({ status: "error" });
  }
});

/////////////////////////////////LOGOWANIE UZYTWKONIKA///////////////////////////////////

app.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User does not exist!" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid password" });
});

/////////////////////////////////WYSWIETLANIE INORMACJI NA TEMAT UZYTKOWNIKA///////////////////////////////////

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});

/////////////////////////////////?????????????????///////////////////////////////////

router.get("/getUserById/:id", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const id = req.params.id;
  try {
    const user = await User.findById(id).exec();
    console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

/////////////////////////////////POZYSKANIE MAILA ZALOGOWANEGO UZYTKOWNIKA ABY ZDOBYC JEGO ID///////////////////////////////////

app.get('/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ id: user._id, block: user.block });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/////////////////////////////////POZYSKANIE ID ZALOGOWANEGO UZYTKOWNIKA///////////////////////////////////
app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/////////////////////////////////WSTAWIENIE ID TRENINGU DO POLA TRAININGS W USERZE///////////////////////////////////
app.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { trainings } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { trainings }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


/////////////////////////////////USUWANIE TRENINGU Z KOLEKCJI USERS///////////////////////////////////
app.patch("/deleteTrainingFromUser/:userId", async (req, res) => {
  const { userId } = req.params;
  const { trainingId } = req.body;

  try {
    const result = await userModel.findByIdAndUpdate(userId, {
      $pull: { trainings: trainingId }
    });
    res.status(200).send('Training removed from user document');
  } catch (error) {
    res.status(500).send(error);
  }
});

///POZYSKANIE ID TRENINGOW Z KOLEKCJI USERS
app.get('/getTrainingByUserId/:userId', (req, res) => {
  const userId = req.params.userId;
  User.findOne({ _id: userId })
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send(user.trainings);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Server error');
    });
});




// endpoint do pobierania treningu po id
router.get('/getWorkoutById/:id', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const workoutId = req.params.id;
  Training.findById(workoutId)
    .then((workout) => {
      res.status(200).json(workout);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving workout by ID');
    });
});


app.get('/getExercises', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/addExerciseToWorkout/:id', async (req, res) => {
  const { id } = req.params;
  const { exercise, sets } = req.body;

  try {
    const workout = await Training.findById(id);
    workout.exercises.push({ exercise: exercise, sets: sets });
    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});



app.patch('/workouts/:workoutId/exercises/:exerciseId', async (req, res) => {
  const { exerciseId,trainingId } = req.params;
  try {
    const result = await Training.findByIdAndUpdate(trainingId, {
      $pull: { exercises: exerciseId }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the training.");
  }
});





app.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.post('/blockUser', async (req, res) => {
  console.log("Request body:", req.body); // dodanie logowania
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.block = true;
    await user.save();

    res.status(200).json({ message: 'User blocked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/unblockUser', async (req, res) => {
  console.log("Request body:", req.body); // dodanie logowania
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.block = false;
    await user.save();

    res.status(200).json({ message: 'User blocked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});







app.listen(3001, () => {
  console.log("serwer dziala");
});