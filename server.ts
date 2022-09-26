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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user: User = {
      name: req.body.name,
      password: hashedPassword,
    };

    users.push(user);

    res.status(201).send();
  } catch (errors) {
    res.status(500).send(errors);
  }
});

app.post('/users/login', async (req, res) => {
  if (users.length === 0) {
    res.status(200).send('No Users');
  }

  const user = users.find((user) => user.name === req.body.name);

  if (user === null) {
    return res.status(400).send('Cannot find user');
  }

  try {
    if (await bcrypt.compare(req.body.password, user!.password)) {
      res.send('Success');
    } else {
      res.send('Not Allowed');
    }
  } catch (errors) {
    res.status(500).send(errors);
  }
});

app.listen(3000);
