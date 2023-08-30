require('dotenv').config();

//create server
const express = require('express')
const app = express();
const mysql = require('mysql')
const cors = require('cors')

//Make available to make request from the front end to the backend
app.use(cors());
//to read json files
app.use(express.json());

//making the connection to the sql database
const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL!');
  });

//Requests

//CREATE
app.post('/create', (req, res) => {
    const game = req.body.game
    const genre = req.body.genre
    const year = req.body.year
    const platform = req.body.platform

    db.query(
        'INSERT INTO games ( game, genre, year, platform) VALUES (?,?,?,?)',
        [game, genre, year, platform], 
        (err, result) => {
            if(err){
                console.log(err);
            } else {
                console.log('values added')
            }
        });
});

//READ 
app.get('/games', (req,res)=>{
    
    db.query("SELECT * FROM games", (err,result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
            console.log('data received')
        }
    })
})

//UPDATE
app.put('/games',(req, res)=>{
    const id = req.body.id
    const game = req.body.game
    const genre = req.body.genre
    const year = req.body.year
    const platform = req.body.platform

    db.query('UPDATE games SET game = ?, genre = ?, year = ?, platform = ? WHERE id =?', 
    [game, genre, year, platform, id], 
    ((err,result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
            console.log('data updated')
        }
    }))
})

//DELETE
app.delete('/games/:id',(req, res)=>{
    const id = req.params.id

    db.query('DELETE FROM games WHERE id = ?', id, 
    (err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
            console.log('data deleted')
        }
    })
})

const PORT = 3001

// port to listen
app.listen(process.env.PORT || PORT , () => {
    console.log(`listening to port ${PORT}`)
})