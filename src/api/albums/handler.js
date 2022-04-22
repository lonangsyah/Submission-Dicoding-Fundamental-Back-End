const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postRekamanHandler = this.postRekamanHandler.bind(this);
    this.getRekamanHandler = this.getRekamanHandler.bind(this);
    this.getRekamanByIdHandler = this.getRekamanByIdHandler.bind(this);
    this.putRekamanByIdHandler = this.putRekamanByIdHandler.bind(this);
    this.deleteRekamanByIdHandler = this.deleteRekamanByIdHandler.bind(this);
  }

  // album
  async postRekamanHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this.service.tambahRekaman({ name, year });

      return h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: { albumId },
      }).code(201);
    } 
    // Apabila mengalami error
    catch (error) {
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

  // GET album
  async getRekamanHandler() {
    const albums = await this.service.tambahRekaman();
    return {
      status: 'success',
      data: { albums },
    };
  }

  async getRekamanByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this.service.tampilRekamanById(id);
      const songs = await this.service.tampilRekamanByMusik(id);

      return {
        status: 'success',
        data: {
          album: {
            ...album,
            songs,
          },
        },
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

  // Put Album
  async putRekamanByIdHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;

      await this.service.editRekamanById(id, { name, year });

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

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      }).code(500);
    }
  }

  // Delete Album
  async deleteRekamanByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.hapusRekamanById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } 
    // Apabila mengalami error
    catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: 'Album gagal dihapus. Id tidak ditemukan.',
        }).code(error.statusCode);
      }

      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      }).code(500);
    }
  }
}

module.exports = AlbumsHandler;
