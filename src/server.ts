import * as dotenv from 'dotenv';
dotenv.config();
//
import express from 'express';
import * as fs from 'fs';

import { Version } from './types';
import { getCachedVersions, getVersions } from './utils';

// make sure some folders are created
if (!fs.existsSync('cache')) fs.mkdirSync('cache', { recursive: true });

// create app
const app = express();

app.use((req, res, next) => {
  if (req.hostname != process.env.WEBSITE) return res.status(403).send(); // prevent unknown hostnames
  next();
});

app.set('view engine', 'ejs');
app.set('views', 'src/front-end');
app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async function (req, res) {
  try {
    const versions = getCachedVersions() || await getVersions();
    res.render('index', {
      versions,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('errors/500', { message: 'There was an unknown error that occured.' });
  }
});

app.get('/mappings', async function (req, res) {
  try {
    const versions = getCachedVersions() || await getVersions();
    const version: Version = versions.filter(a => a.id == req.query.version)[0];
    if (!version) return res.status(404).render('errors/404', { message: 'Could not find supplied version' });
    res.send(version);
  } catch (e) {
    console.error(e);
    res.status(500).render('errors/500', { message: 'There was an unknown error that occured.' });
  }
});

app.all('*', (req, res) => {
  res.status(404).render('errors/404');
});

app.listen(process.env.PORT || 80, () => {
  console.log(`Website started at localhost:${process.env.PORT || 80}`);
});