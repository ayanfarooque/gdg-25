module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
      // or alternatively:
      // fn(req, res, next).catch(err => next(err));
    };
  };