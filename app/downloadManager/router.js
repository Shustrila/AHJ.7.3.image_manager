import Router from 'koa-router';
import DownloadManager from './DownloadManager';

const router = new Router();
const downloadManager = new DownloadManager(`https://ahj-download-manager.herokuapp.com`);

router.get('/downloadManager', downloadManager.getAll.bind(downloadManager));

router.post('/downloadManager', downloadManager.post.bind(downloadManager));

router.delete('/downloadManager/:id', downloadManager.delete.bind(downloadManager));

module.exports = router;
