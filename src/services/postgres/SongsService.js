const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongToModel, mapSongToDetailedModel } = require('../../utils/index');

class SongService {
  constructor() {
    this.pool = new Pool();
  }

  async tambahMusik(payload) {
    const id = `song-${nanoid(16)}`;
    const {
      title, year, genre, performer, duration, albumId,
    } = payload;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getMusik(title = '', performer = '') {
    if (title || performer) {
      let query;

      if (title && performer) {
        query = {
          text: 'SELECT * FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
          values: [`%${title}%`, `%${performer}%`],
        };
      } else if (title) {
        query = {
          text: 'SELECT * FROM songs WHERE title ILIKE $1',
          values: [`%${title}%`],
        };
      } else if (performer) {
        query = {
          text: 'SELECT * FROM songs WHERE performer ILIKE $1',
          values: [`%${performer}%`],
        };
      }

      const result = await this.pool.query(query);
      return result.rows.map(mapSongToModel);
    }

    const result = await this.pool.query('SELECT * FROM songs');
    return result.rows.map(mapSongToModel);
  }

  async getMusikById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapSongToDetailedModel)[0];
  }

  async editMusikById(id, payload) {
    const {
      title, year, genre, performer, duration, albumId,
    } = payload;
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteMusikById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
