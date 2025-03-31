exports.successResponse = function (res, msg) {
  const data = {
    status: 1,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
  const resData = {
    status: 1,
    message: msg,
    data: data,
  };
  return res.status(200).json(resData);
};

exports.HttpResponse = function (res, status, data) {
  return res.status(status).json(data);
};
exports.ErrorResponse = function (res, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(500).json(data);
};
exports.errorResponseWithCode = function (res, code, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(code).json(data);
};
exports.notFoundResponse = function (res, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, errors) {
  const resData = {
    status: 0,
    message: msg,
    errors: errors.map((err) => {
      return err.msg;
    }),
  };
  return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  const data = {
    status: 0,
    message: msg,
  };
  return res.status(401).json(data);
};
