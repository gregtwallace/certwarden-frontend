import { type FC } from 'react';

import WorkQueuePage from '../../Pages/WorkQueuePage/WorkQueuePage';

const OrderFulfillQueue: FC = () => {
  return (
    <WorkQueuePage
      apiUrl='/v1/orders/fulfilling/status'
      description='Below are the orders LeGo is working with an ACME Server to complete.'
      helpUrl='https://www.legocerthub.com/docs/user_interface/order_queue/'
      queueName='Order ACME Fulfillment'
    />
  );
};

export default OrderFulfillQueue;
