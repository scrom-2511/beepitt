import { Router } from 'express';
import { checkLoggedIn } from '../controllers/auth/checkLoggedIn';
import { googleAuthController } from '../controllers/auth/googleAuth.controller';
import { otpValidateController } from '../controllers/auth/otpValidator.controller';
import { signinController } from '../controllers/auth/Signin.Controller';
import { signupController } from '../controllers/auth/Signup.Controller';
import { getAllClosedIssuesByUserId } from '../controllers/issues/getIssues/getAllClosedIssuesByUserId.controller';
import { getAllOpenIssuesByUserId } from '../controllers/issues/getIssues/getAllOpenIssuesByUserId.controller';
import { getAllUnseenErrorsByUserId } from '../controllers/issues/getIssues/getAllUnseenErrorsByUserId.controller';
import { razorpayCreateOrderController } from '../controllers/payment/razorpayCreateOrder.controller';
import { getProfileDetailsAndPreferncesController } from '../controllers/profile/getProfileDetailsAndPrefernces.controller';
import { updateProfileController } from '../controllers/profile/updateProfileController';
import { updateTimeZoneAndPreferencesController } from '../controllers/profile/updateTimeZoneAndPreferences.controller';
import { getTeamInfoController } from '../controllers/team/getTeamInfo.controller';
import { isLoggedIn } from '../middlewares/isLoggedIn';

export const userRouter = Router();

userRouter.get('/isLoggedIn', isLoggedIn, checkLoggedIn);
userRouter.post('/signup', signupController);
userRouter.post('/signin', signinController);
userRouter.post('/otpValidator', isLoggedIn, otpValidateController);
userRouter.post('/googleAuth', googleAuthController);

userRouter.post('/updateProfileDetails', isLoggedIn, updateProfileController);
userRouter.post(
  '/updateTimeZoneAndPreferences',
  isLoggedIn,
  updateTimeZoneAndPreferencesController,
);
userRouter.get(
  '/getProfileDetailsAndPreferences',
  isLoggedIn,
  getProfileDetailsAndPreferncesController,
);
userRouter.post(
  '/updateTimeZoneAndPreferences',
  isLoggedIn,
  updateTimeZoneAndPreferencesController,
);

userRouter.get('/getTeamInfo', isLoggedIn, getTeamInfoController);

userRouter.post(
  '/razorPayCreateOrder',
  isLoggedIn,
  razorpayCreateOrderController,
);

userRouter.get('/getUnseenIssues', isLoggedIn, getAllUnseenErrorsByUserId);
userRouter.get('/getOpenIssues', isLoggedIn, getAllOpenIssuesByUserId);
userRouter.get(
  '/getClosedIssues',
  isLoggedIn,
  getAllClosedIssuesByUserId,
);

userRouter.get('/getmyip', (req, res) => {
  console.log(req.headers['x-forwarded-for']);
  const ips = (req.headers['x-forwarded-for'] || req.socket.remoteAddress)
    ?.toString()
    .split(',');
  const ipv4 = ips?.find((ip) => ip.includes('.'));
  const ipv6 = ips?.find((ip) => ip.includes(':'));

  const ip = ipv4 || ipv6 || null;
  console.log(ip);

  res.send({ ipv4, ipv6 });
});
