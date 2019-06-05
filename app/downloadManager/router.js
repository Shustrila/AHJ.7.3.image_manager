import Router from 'koa-router';
import DownloadManager from './DownloadManager';

const { PORT } = process.env;
const port = PORT || 7070;
const router = new Router();
const downloadManager = new DownloadManager(`http://localhost:${port}`);

router.get('/tickets', downloadManager.getAll.bind(downloadManager));

router.post('/tickets', downloadManager.post.bind(downloadManager));

router.delete('/tickets/:id', downloadManager.delete.bind(downloadManager));

module.exports = router;
