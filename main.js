import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import koaCors from 'koa-cors';
import koaStatic from 'koa-static';
import fs from "fs";

const app = new Koa();
const { PWD, PORT } = process.env;
const port = PORT || 7070;
const upload = `${PWD}/upload`;

if (!fs.existsSync(upload)) fs.mkdirSync(upload);


app.use(koaBody({ urlencoded: true, multipart: true }));

app.use(koaStatic(upload));

app.use(koaCors({ origin: '*',  methods: ['GET', 'POST', 'DELETE']}));

app.use(require('./app/downloadManager/router').routes());

http.createServer(app.callback()).listen(port);
