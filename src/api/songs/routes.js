const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusikHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getMusikHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getMusikByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putMusikByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteMusikByIdHandler,
  },
];
  
module.exports = routes;