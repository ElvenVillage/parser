import express from 'express';
const app = express();

import { region } from './regions.mjs';
import { parse } from './parser.mjs';

const port = process.env.PORT || 3000


app.use(express.static('public'));

app.use(express.json());
app.post('/find', async (req, res) => res.send(await parse(req.body.region, req.body.name)));
app.post('/region', async (req, res) => res.send(await region(req.body.region)));

app.listen(port);