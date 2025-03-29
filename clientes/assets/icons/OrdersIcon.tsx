import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface OrdersIconProps extends SvgProps {
  fill?: string;
  size?: number;
  accessibilityLabel?: string;
}

const OrdersIcon: React.FC<OrdersIconProps> = ({
  fill = 'black',
  size = 28,
  accessibilityLabel = 'Icono de pedidos',
  ...props
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <Path
      d="m6.3 19.27 6.962 3.885c.483.273.975.273 1.459 0l6.96-3.885c.853-.474 1.275-.966 1.275-2.206V9.938c0-.932-.351-1.521-1.142-1.97l-6.18-3.462c-1.08-.607-2.197-.607-3.286 0l-6.18 3.463c-.781.448-1.133 1.037-1.133 1.969v7.127c0 1.24.422 1.732 1.266 2.206Zm11.813-8.824-6.495-3.63 1.442-.808c.632-.36 1.23-.37 1.872 0l5.537 3.12-2.356 1.318Zm-4.122 2.303L7.522 9.128l2.426-1.38 6.487 3.63-2.444 1.371Zm-6.723 5.16c-.484-.273-.65-.546-.65-1.011v-6.381l6.547 3.691v7.031l-5.897-3.33Zm13.456 0-5.907 3.33v-7.031l6.548-3.691v6.38c0 .466-.167.739-.641 1.011Z"
      fill={fill}
    />
  </Svg>
);

export default OrdersIcon;
