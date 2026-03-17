import { getBillingDetailsHandler } from '@/requestHandler/billing/getBillingDetails.reqhandler';
import { converUtcToLocaleDate } from '@/utils/UtcToLocale';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ButtonComp from '../ButtonComp';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Fallback from './Fallback';

const Billing = () => {
  const navigate = useNavigate();
  const {
    data: billingDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetailsHandler,
  });

  if (isError || isLoading || billingDetails === undefined) {
    return (
      <Fallback
        data={undefined}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        emptyTitle="Unseen Issues"
      />
    );
  }

  return (
    <section className="xl:grid xl:grid-cols-2 p-5 gap-5 flex flex-col">
      {/* Current Plan Card */}
      <div>
        <Card className="bg-card justify-between p-6 sm:p-8 md:p-12 m-0 h-full">
          <CardHeader className="p-0">
            <CardTitle className="font-light mb-2 text-muted-foreground text-sm sm:text-base">Current Plan</CardTitle>
            <CardDescription className="text-3xl sm:text-4xl md:text-6xl font-semibold">
              {billingDetails?.subscription_tier}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-0 mt-5">
            <ButtonComp
              onClick={() => {
                navigate('/pricing');
              }}
            >
              Upgrade Now
            </ButtonComp>
          </CardFooter>
        </Card>
      </div>

      {/* Plan Details Card */}
      <div>
        <Card className="bg-card p-6 sm:p-8 md:p-12 h-full">
          <CardHeader className="p-0 w-full grid grid-rows-[auto_1fr] h-full">
            <CardTitle className="font-light mb-2 text-muted-foreground text-sm sm:text-base">Plan Details</CardTitle>
            <CardContent className="mt-3 sm:mt-5 p-0 text-sm sm:text-base">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {[
                    {
                      label: 'Current Status:',
                      value: billingDetails?.currentStatus,
                    },
                    { label: 'Billing Cycle:', value: 'Monthly' },
                    {
                      label: 'Valid Till:',
                      value: converUtcToLocaleDate(billingDetails?.validTill!, localStorage.getItem('timeZone')!),
                    },
                    { label: 'Plan Amount:', value: '$10' },
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-foreground/25">
                      <td className="py-2 font-medium">{item.label}</td>
                      <td className="py-2">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      {/* <LastMonthPaymentDetails />
      <RewardsTimeline /> */}
    </section>
  );
};

export default Billing;

// Last Month Payment Details
// const lastMonthPaymentDetails = [
//   { label: "Date", value: "10/12/32" },
//   { label: "Subscription Type", value: "Starter" },
//   { label: "Status", value: "Success" },
// ];

// const LastMonthPaymentDetails = () => {
//   return (
//     <Card className="bg-card p-6 sm:p-8 md:p-12 h-full col-span-2">
//       <CardHeader className="p-0 w-full grid grid-rows-[auto_1fr] h-full">
//         <CardTitle className="font-light mb-2 text-muted-foreground text-sm sm:text-base">
//           Payment Details Of Last Month
//         </CardTitle>
//       </CardHeader>
//       <div className="flex flex-col sm:flex-row items-center justify-center h-full my-5">
//         {lastMonthPaymentDetails.map((item, index) => (
//           <>
//             <div className="flex-1 flex flex-col items-center mb-4 sm:mb-0">
//               <CardTitle className="font-light mb-1 text-muted-foreground text-sm sm:text-base">
//                 {item.label}
//               </CardTitle>
//               <CardDescription className="text-foreground text-sm sm:text-base">
//                 {item.value}
//               </CardDescription>
//             </div>
//             {index !== lastMonthPaymentDetails.length - 1 && (
//               <div className="w-px h-10 bg-foreground opacity-25 mx-2 sm:mx-4" />
//             )}
//           </>
//         ))}
//       </div>
//     </Card>
//   );
// };

// const RewardsTimeline = () => {
//   return (
//     <Card className="bg-card p-6 sm:p-8 md:p-12 h-full col-span-2">
//       <CardHeader className="p-0 mb-5">
//         <CardTitle className="font-medium text-sm sm:text-base text-foreground">
//           Reward Timeline
//         </CardTitle>
//         <CardDescription className="font-light text-xs sm:text-sm text-muted-foreground">
//           Subscribe for five consecutive months and get{" "}
//           <strong className="font-bold">your sixth month free</strong>! The free
//           month will be automatically added to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="px-2 sm:px-5 md:px-28 flex items-center my-10">
//         {/* Step 1 */}
//         <div className="h-3 w-3 bg-green-500 rounded-full z-10" />
//         <div className="flex-1 h-px bg-green-500" />
//         {/* Step 2 */}
//         <div className="h-3 w-3 bg-green-500 rounded-full z-10" />
//         <div className="flex-1 h-px bg-muted-foreground" />
//         {/* Step 3 */}
//         <div className="h-3 w-3 bg-red-50 rounded-full z-10" />
//         <div className="flex-1 h-px bg-muted-foreground" />
//         {/* Step 4 */}
//         <div className="h-3 w-3 bg-red-50 rounded-full z-10" />
//         <div className="flex-1 h-px bg-muted-foreground" />
//         {/* Step 5 */}
//         <div className="h-3 w-3 bg-red-50 rounded-full z-10" />
//       </CardContent>
//     </Card>
//   );
// };
