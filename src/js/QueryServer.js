class QueryServer {
    constructor(url) {
        this._url = url;
        this.config = {};
    }

    async get(callback = () => {}) {
        try {
            this.config.method = 'GET';

            const query = await fetch(this._url, this.config);
            const data = await query.json();

            return callback(data);
        } catch (e) {
            throw new Error(e);
        } finally {
            this.config = {}
        }
    }

    async post(body, callback = () => {}) {
        try {
            this.config.method = 'POST';
            this.config.body = body;

            const query = await fetch(this._url, this.config);
            const data = await query.json();

            return callback(data);
        } catch (e) {
            throw new Error(e);
        } finally {
            this.config = {}
        }
    }

    async delete(id, callback = () => {}) {
        try {
            this.config.method = 'DELETE';
            this.config.mode = 'cors';

            const query = await fetch(`${this._url}/${id}`, this.config);
            const data = await query.json();

            return callback(data);
        } catch (e) {
            throw new Error(e);
        } finally {
            this.config = {}
        }
    }
}

export default QueryServer;
