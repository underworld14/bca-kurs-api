import httpStatus from 'http-status';
import HttpException from 'exceptions/HttpException';
import DB from 'models';
import * as security from 'utils/security';

/**
 * Handle user register.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
export const register = async (req, res) => {
  // find duplicate email
  const duplicate = await DB.User.findOne({ where: { email: req.body.email } });
  if (duplicate) {
    throw new HttpException(httpStatus.BAD_REQUEST, 'email is exist');
  }

  // if user doesn't input role, make admin as default role for now.
  req.body.role = 'admin';

  // hash password
  req.body.password = await security.hashPasword(req.body.password);

  // create the user & issued the token
  let user = await DB.User.create(req.body);
  const access_token = security.generateToken({ id: user.id });

  // delete password from response
  user = user.toJSON();
  delete user.password;

  // also send token as http-cookie
  security.sendTokenCookie(res, access_token);

  return res.status(200).json({
    message: 'success',
    user,
    access_token,
  });
};

/**
 * Handle user login.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
export const login = async (req, res, next) => {
  let user = await DB.User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new HttpException(httpStatus.BAD_REQUEST, 'wrong email or password'));
  }

  // compared user password
  const compare = await security.comparePassword(req.body.password, user.password);
  if (!compare) {
    return next(new HttpException(httpStatus.BAD_REQUEST, 'wrong email or password'));
  }

  const access_token = security.generateToken({ id: user.id });

  // delete password from response
  user = user.toJSON();
  delete user.password;

  // also send token as http-cookie
  security.sendTokenCookie(res, access_token);

  return res.status(200).json({
    message: 'success',
    user,
    access_token,
  });
};

export const check = (req, res) => {
  return res.status(200).json({
    message: 'success',
    user: req.user.toJSON(),
  });
};
