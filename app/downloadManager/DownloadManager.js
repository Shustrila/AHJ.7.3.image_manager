import path from 'path';
import fs from 'fs';
import uuid from 'uuid';

class DownloadManager {
    constructor(url) {
        this.ids = 0;
        this._listImg = [];
        this._url = url
    }

    async getAll(ctx, next) {
        try {
            ctx.response.body = this._listImg;

            await next();
        } catch (e) {
            throw new Error(e)
        }
    }

    _addImage(image) {
        const { PWD } = process.env;
        const formatFile = new RegExp('.[\\w]+$', 'i').exec(image.name);
        const fileName = uuid.v4() + formatFile[0];
        const file = path.join(`${PWD}/upload`, fileName);
        const readStream = fs.createReadStream(image.path);
        const writeStream = fs.createWriteStream(file);
        const data = {};

        data.id = this.ids++;
        data.url = this._url + '/' + fileName;

        readStream.pipe(writeStream);

        this._listImg.push(data);
    }

    async post(ctx, next) {
        try {
            const { images } = ctx.request.files;

            if (Array.isArray(images)) {
                for (const image of images) {
                    this._addImage(image);
                }
            } else {
                this._addImage(images);
            }

            ctx.response.body = this._listImg;

            await next();
        } catch (e) {
            throw new Error(e)
        }
    }


    async delete(ctx, next) {
        try {
            const paramId = Number(ctx.params.id);
            const listImg = [];

            for (const img of this._listImg) {
                if (img.id !== paramId) {
                    listImg.push(img);
                }
            }

            this._listImg = listImg;
            ctx.response.body = this._listImg;

            await next();
        } catch (e) {
            throw new Error(e)
        }
    }
}

export default DownloadManager;
