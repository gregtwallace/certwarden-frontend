import { type FC } from 'react';

import WorkQueuePage from '../../Pages/WorkQueuePage/WorkQueuePage';

const OrderFulfillQueue: FC = () => {
  return (
    <WorkQueuePage
      apiUrl='/v1/orders/fulfilling/status'
      description='Below are the orders Cert Warden is working with an ACME Server to complete.'
      helpUrl='https://www.certwarden.com/docs/user_interface/order_queue/'
      queueName='Order ACME Fulfillment'
    />
  );
};

export default OrderFulfillQueue;
