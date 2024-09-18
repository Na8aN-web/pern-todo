const PORT = process.env.PORT ?? 8000;
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const pool = require('./db');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('hello');
})

app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    try {
        const result = await pool.query('SELECT * FROM todos WHERE USER_EMAIL = $1', [userEmail]);
        res.json(result.rows); // Send the result rows as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching todos');
    }
});

app.post('/todos', async (req, res) => {
    const { user_email, title, progress, date } = req.body
    console.log(user_email, title, progress, date)
    const id = uuidv4()
    try {
        const newTodo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
            [id, user_email, title, progress, date]
        )
        res.json(newTodo)
    } catch (error) {
        console.error(error);
    }
})

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date } = req.body
    try {
        const editTodo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;', [user_email, title, progress, date, id])
        res.json(editTodo)
    } catch (error) {
        console.error(error);
    }
})

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    // const { user_email, title, progress, date } = req.body
    try {
        const deleteTodo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
        res.json(deleteTodo)
    } catch (error) {
        console.error(error);
    }
})

app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`,
            [email, hashedPassword]
        )

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {expiresIn: '1hr'})
        res.json({email, token})
    } catch (error) {
        console.error(error)
        if (error){
            res.json({detail: error.detail})
        }
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(!users.rows.length) return res.json({detail: 'User does not exist'})
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {expiresIn: '1hr'})

        if (success) {
            res.json({'email': users.rows[0].email, token})
        } else{
            res.json({ detail: "Login failed"})
        }
    } catch (error) {
        console.error(error)
    }
})


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))