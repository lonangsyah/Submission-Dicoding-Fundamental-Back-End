const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postMusikHandler = this.postMusikHandler.bind(this);
    this.getMusikHandler = this.getMusikHandler.bind(this);
    this.getMusikByIdHandler = this.getMusikByIdHandler.bind(this);
    this.putMusikByIdHandler = this.putMusikByIdHandler.bind(this);
    this.deleteMusikByIdHandler = this.deleteMusikByIdHandler.bind(this);
  }

  // Mengatur Songs
  async postMusikHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      const songId = await this.service.tambahMusik({
        title, year, genre, performer, duration, albumId,
      });

      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: { songId },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      }).code(500);
    }
  }

  // GET Lagu
  async getMusikHandler(request) {
    const { title, performer } = request.query;

    const songs = await this.service.getMusik(title, performer);
    return {
      status: 'success',
      data: { songs },
    };
  }

  async getMusikByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this.service.getMusikById(id);

      return {
        status: 'success',
        data: { song },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      }).code(500);
    }
  }

  // PUT Lagu
  async putMusikByIdHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;

      await this.service.editMusikById(id, {
        title, year, genre, performer, duration, albumId,
      });

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      console.error(error.message);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      }).code(500);
    }
  }

  // DELETE Lagu
  async deleteMusikByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteMusikById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: 'Lagu gagal dihapus. Id tidak ditemukan.',
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      }).code(500);
    }
  }
}

module.exports = SongsHandler;
