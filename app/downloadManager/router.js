import Router from 'koa-router';
import DownloadManager from './DownloadManager';

const router = new Router();
const downloadManager = new DownloadManager(`https://ahj-download-manager.herokuapp.com`);

router.get('/tickets', downloadManager.getAll.bind(downloadManager));

router.post('/tickets', downloadManager.post.bind(downloadManager));

router.delete('/tickets/:id', downloadManager.delete.bind(downloadManager));

module.exports = router;
