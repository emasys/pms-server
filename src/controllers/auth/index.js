const hello = {
  path: '/hello',
  method: 'GET',
  options: {
    description: 'Simple hello world route',
    notes: 'Testing self documenting endpoint',
    tags: ['api'],
  },
  handler(request, h) {
    return { message: 'hello world' };
  },
};

export { hello };
