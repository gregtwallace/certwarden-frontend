import { type FC } from 'react';

import WorkQueuePage from '../../Pages/WorkQueuePage/WorkQueuePage';

const OrderPostProcessQueue: FC = () => {
  return (
    <WorkQueuePage
      apiUrl='/v1/orders/post-process/status'
      description='Below are the orders LeGo is performing post processing actions for.'
      helpUrl='https://www.legocerthub.com/docs/user_interface/order_post_queue/'
      queueName='Order Post Processing'
    />
  );
};

export default OrderPostProcessQueue;
