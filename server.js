const express = require('express');
const app = express();

const db = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./api/db/usda-nnd.sqlite3"
  }
});
db.debug = true;

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/food', (req, res) => {

  const param = req.query.q;

  console.log(`Looking up foods filtered by ${param}`);

  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }

  db.select('*')
  .from('entries')
  .where('description', 'like', `%${param}%`)
  .limit(100)
  .then((data) => res.json(data));

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
