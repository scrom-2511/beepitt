import { BACKEND_URL } from '@/config/app.config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Getip = () => {
  const getMyIp = async () => {
    const res = await axios.get(BACKEND_URL + '/user/__debug', {
      withCredentials: true,
    });
    return res.data;
  };
  const { data, isLoading, isPending } = useQuery({
    queryKey: ['asdf'],
    queryFn: getMyIp,
  });
  console.log('The data is');
  console.log(data);
  if (isPending) {
    return <></>;
  }
  return (
    <div className="text-xs line-clamp-2 text-white">
      <div>{data.ipv4}</div>
      <div>this is </div>
      <div>{data.ipv6}</div>
    </div>
  );
};

export default Getip;
