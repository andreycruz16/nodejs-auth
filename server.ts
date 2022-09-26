import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

interface User {
  name: string;
  password: string;
}

const users: User[] = [];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user: User = {
      name: req.body.name,
      password: hashedPassword,
    };

    users.push(user);

    res.status(201).send();
  } catch (error) {
    console.log(error);

    res.status(500).send();
  }
});

app.listen(3000);
