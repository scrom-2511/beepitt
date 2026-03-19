import { Router } from 'express';
import { checkLoggedIn } from '../controllers/auth/checkLoggedIn';
import { googleAuthController } from '../controllers/auth/googleAuth.controller';
import { otpValidateController } from '../controllers/auth/otpValidator.controller';
import { signinController } from '../controllers/auth/Signin.Controller';
import { signupController } from '../controllers/auth/Signup.Controller';
import { getBillingDetailsController } from '../controllers/billing/getBillingDetails.controller';
import { getConfigurationsController } from '../controllers/configuration/getConfigurations.controller';
import { updateGlobalThrottleWindowController } from '../controllers/configuration/updateGlobalThrottleWindow.controller';
import { updateNotificationChannelsController } from '../controllers/configuration/updateNotificationChannels.controller';
import { updateRetryConfigController } from '../controllers/configuration/updateRetryConfig.controller';
import { getAllSeenIncidentsController } from '../controllers/incidents/getIncidents/getAllSeenIncidents.controller';
import { getAllUnseenIncidentsController } from '../controllers/incidents/getIncidents/getAllUnseenIncidents.controller';
import { updateIncidentSeenController } from '../controllers/incidents/updateIncidents/updateIncidentSeen.controller';
import { getAllClosedIssuesController } from '../controllers/issues/getIssues/getAllClosedIssues.controller';
import { getAllOpenIssuesController } from '../controllers/issues/getIssues/getAllOpenIssues.controller';
import { getAllUnseenIssuesController } from '../controllers/issues/getIssues/getAllUnseenIssues.controller';
import { updateIssuePriorityController } from '../controllers/issues/updateIssues/updateIssuePriority.controller';
import { razorpayCreateOrderController } from '../controllers/payment/razorpayCreateOrder.controller';
import { getProfileDetailsAndPreferncesController } from '../controllers/profile/getProfileDetailsAndPrefernces.controller';
import { updateProfileDetailsController } from '../controllers/profile/updateProfileDetails.controller';
import { updateTimeZoneAndPreferencesController } from '../controllers/profile/updateTimeZoneAndPreferences.controller';
import { createProjectController } from '../controllers/project/createProject.controller';
import { getAllProjectsController } from '../controllers/project/getAllProjects.controller';
import { getProjectDetailsController } from '../controllers/project/getProjectDetails.controller';
import { getTeamInfoController } from '../controllers/team/getTeamInfo.controller';
import { checkLastId } from '../middlewares/checkLastId';
import { isLoggedIn } from '../middlewares/isLoggedIn';

export const userRouter = Router();

userRouter.get('/checkLoggedIn', isLoggedIn, checkLoggedIn);
userRouter.post('/signup', signupController);
userRouter.post('/signin', signinController);
userRouter.post('/otpValidator', isLoggedIn, otpValidateController);
userRouter.post('/googleAuth', googleAuthController);

userRouter.post('/updateProfileDetails', isLoggedIn, updateProfileDetailsController);
userRouter.post('/updateTimeZoneAndPreferences', isLoggedIn, updateTimeZoneAndPreferencesController);
userRouter.get('/getProfileDetailsAndPreferences', isLoggedIn, getProfileDetailsAndPreferncesController);
userRouter.get('/getProjectDetails/:projectId', isLoggedIn, getProjectDetailsController);

userRouter.get('/getTeamInfo', isLoggedIn, getTeamInfoController);
userRouter.get('/getAllProjects', isLoggedIn, getAllProjectsController);
userRouter.post('/createProject', isLoggedIn, createProjectController);

userRouter.get('/getBillingDetails', isLoggedIn, getBillingDetailsController);

userRouter.post('/razorPayCreateOrder', isLoggedIn, razorpayCreateOrderController);

userRouter.get('/getUnseenIssues', isLoggedIn, checkLastId, getAllUnseenIssuesController);
userRouter.get('/getOpenIssues', isLoggedIn, checkLastId, getAllOpenIssuesController);
userRouter.get('/getClosedIssues', isLoggedIn, checkLastId, getAllClosedIssuesController);
userRouter.post('/updateIssuePriority', isLoggedIn, updateIssuePriorityController);

userRouter.get('/getUnseenIncidents', isLoggedIn, checkLastId, getAllUnseenIncidentsController);
userRouter.get('/getSeenIncidents', isLoggedIn, checkLastId, getAllSeenIncidentsController);
userRouter.post('/updateIncidentSeen', isLoggedIn, updateIncidentSeenController);

userRouter.get('/getConfigurations', isLoggedIn, getConfigurationsController);
userRouter.post('/updateNotificationChannels', isLoggedIn, updateNotificationChannelsController);
userRouter.post('/updateGlobalThrottleWindow', isLoggedIn, updateGlobalThrottleWindowController);
userRouter.post('/updateRetryConfig', isLoggedIn, updateRetryConfigController);