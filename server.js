const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post('/submit', async (req, res) => {
  try {

    const { username, badhabit } = req.body;

    if (!username || !badhabit) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          username,
          badhabit
        }
      ]);

    if (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
