const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postRekamanHandler,
    },
    {
      method: 'GET',
      path: '/albums',
      handler: handler.getRekamanHandler,
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getRekamanByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putRekamanByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteRekamanByIdHandler,
    },
  ];
  
  module.exports = routes;
  