import { Router } from 'express';
import { aiChatController } from '../controllers/ai/chat.controller';
import { getChatHistoryController } from '../controllers/ai/getChatHistory.controller';
import { getAnalyticsDataController } from '../controllers/analytics/getAnalyticsData.controller';
import { checkLoggedIn } from '../controllers/auth/checkLoggedIn';
import { googleAuthController } from '../controllers/auth/googleAuth.controller';
import { otpSenderController } from '../controllers/auth/otpSender.controller';
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
import { getIssueByIdController } from '../controllers/issues/getIssues/getIssueById.controller';
import { getAllUnseenIssuesController } from '../controllers/issues/getIssues/getAllUnseenIssues.controller';
import { updateIssuePriorityController } from '../controllers/issues/updateIssues/updateIssuePriority.controller';
import { razorpayCreateOrderController } from '../controllers/payment/razorpayCreateOrder.controller';
import { razorpayVerifyPaymentController } from '../controllers/payment/razorpayVerifyPayment.controller';
import { getProfileDetailsAndPreferncesController } from '../controllers/profile/getProfileDetailsAndPrefernces.controller';
import { updateProfileDetailsController } from '../controllers/profile/updateProfileDetails.controller';
import { updateTimeZoneAndPreferencesController } from '../controllers/profile/updateTimeZoneAndPreferences.controller';
import { createProjectController } from '../controllers/project/createProject.controller';
import { getAllGroupsController } from '../controllers/project/getAllGroups.controller';
import { getAllProjectsController } from '../controllers/project/getAllProjects.controller';
import { getProjectDetailsController } from '../controllers/project/getProjectDetails.controller';
import { updateContactDetailsController } from '../controllers/project/updateContactDetails.controller';
import { getTeamInfoController } from '../controllers/team/getTeamInfo.controller';
import { checkLastId } from '../middlewares/checkLastId';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { isVerified } from '../middlewares/isVerified';

export const userRouter = Router();

// Auth
userRouter.get('/checkLoggedIn', isLoggedIn, isVerified, checkLoggedIn);
userRouter.post('/signup', signupController);
userRouter.post('/signin', signinController);
userRouter.post('/otpValidator', isLoggedIn, otpValidateController);
userRouter.get('/otpSender', isLoggedIn, otpSenderController);
userRouter.post('/googleAuth', googleAuthController);

// Profile
userRouter.post('/updateProfileDetails', isLoggedIn, isVerified, updateProfileDetailsController);
userRouter.post('/updateTimeZoneAndPreferences', isLoggedIn, isVerified, updateTimeZoneAndPreferencesController);
userRouter.get('/getProfileDetailsAndPreferences', isLoggedIn, isVerified, getProfileDetailsAndPreferncesController);

// Projects
userRouter.get('/getProjectDetails/:projectId', isLoggedIn, isVerified, getProjectDetailsController);
userRouter.get('/getTeamInfo', isLoggedIn, isVerified, getTeamInfoController);
userRouter.get('/getAllProjects', isLoggedIn, isVerified, getAllProjectsController);
userRouter.post('/createProject', isLoggedIn, isVerified, createProjectController);
userRouter.post('/updateContactDetails', isLoggedIn, isVerified, updateContactDetailsController);

// Billing & Payment
userRouter.get('/getBillingDetails', isLoggedIn, isVerified, getBillingDetailsController);
userRouter.post('/razorPayCreateOrder', isLoggedIn, isVerified, razorpayCreateOrderController);
userRouter.post('/razorPayVerifyPayment', isLoggedIn, isVerified, razorpayVerifyPaymentController);

// Issues
userRouter.get('/getUnseenIssues', isLoggedIn, isVerified, checkLastId, getAllUnseenIssuesController);
userRouter.get('/getOpenIssues', isLoggedIn, isVerified, checkLastId, getAllOpenIssuesController);
userRouter.get('/getClosedIssues', isLoggedIn, isVerified, checkLastId, getAllClosedIssuesController);
userRouter.get('/getIssueById/:issueId', isLoggedIn, isVerified, getIssueByIdController);
userRouter.post('/updateIssuePriority', isLoggedIn, isVerified, updateIssuePriorityController);

// Incidents
userRouter.get('/getUnseenIncidents', isLoggedIn, isVerified, checkLastId, getAllUnseenIncidentsController);
userRouter.get('/getSeenIncidents', isLoggedIn, isVerified, checkLastId, getAllSeenIncidentsController);
userRouter.post('/updateIncidentSeen', isLoggedIn, isVerified, updateIncidentSeenController);

// Configurations
userRouter.get('/getConfigurations', isLoggedIn, isVerified, getConfigurationsController);
userRouter.post('/updateNotificationChannels', isLoggedIn, isVerified, updateNotificationChannelsController);
userRouter.post('/updateGlobalThrottleWindow', isLoggedIn, isVerified, updateGlobalThrottleWindowController);
userRouter.post('/updateRetryConfig', isLoggedIn, isVerified, updateRetryConfigController);

// Analytics (new)
userRouter.get('/getAnalyticsData', isLoggedIn, isVerified, getAnalyticsDataController);

// Groups
userRouter.get('/getAllGroups', isLoggedIn, isVerified, getAllGroupsController);

// AI Chat
userRouter.post('/aiChat', isLoggedIn, isVerified, aiChatController);
userRouter.get('/getChatHistory/:chatID', isLoggedIn, isVerified, getChatHistoryController);
