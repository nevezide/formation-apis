const getStatus = (_, res) => {
  res.send({
    data: {
      api: 'ok',
    },
  });
};

export default {
  getStatus,
};
