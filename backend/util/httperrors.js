const STATUS_401 = {
  status: 401,
  error: "Unauthorized Access",
};

const STATUS_200 = {
  status: 200,
  message: "OK",
};

const STATUS_409 = {
  status: 409,
  error: "There is some conflict",
};

const STATUS_404 = {
  status: 404,
  error: "Not Found",
};

const STATUS_500 = {
  status: 500,
  error: "Internal Server Error",
};

const errorHandler = async (res, err) => {
  console.log(err);
  switch (err.status) {
    case 401:
      res
        .status(STATUS_401.status)
        .json({ ...STATUS_401, message: err.message });
      break;
    case 500:
      res
        .status(STATUS_500.status)
        .json({ ...STATUS_500, message: err.message });
      break;
    case 409:
      res
        .status(STATUS_409.status)
        .json({ ...STATUS_409, message: err.message });
      break;
    case 404:
      res
        .status(STATUS_404.status)
        .json({ ...STATUS_404, message: err.message });
      break;
  }
  res.end();
};

module.exports = errorHandler;
