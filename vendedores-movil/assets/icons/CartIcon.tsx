import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface CartIconProps extends SvgProps {
  fill?: string;
  size?: number;
  accessibilityLabel?: string;
}

const CartIcon: React.FC<CartIconProps> = ({
  fill = 'black',
  size = 28,
  accessibilityLabel = 'Icono de carrito',
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
      d="M10.74 18.655h10.23a.787.787 0 1 0 0-1.573H10.94c-.421 0-.685-.29-.747-.738l-.132-.914H21.04c1.345 0 2.057-.818 2.25-2.154l.66-4.403c.017-.114.034-.264.034-.36 0-.519-.36-.87-.966-.87H8.928l-.131-.95c-.114-.764-.422-1.151-1.398-1.151H4.385a.85.85 0 0 0-.826.835c0 .457.386.844.826.844h2.75l1.363 9.299c.193 1.327.897 2.135 2.241 2.135Zm11.416-9.44-.553 3.903c-.07.448-.308.73-.739.73l-11.03.008-.677-4.64h13ZM11.46 23.068c.852 0 1.538-.685 1.538-1.538 0-.852-.685-1.538-1.538-1.538s-1.538.686-1.538 1.538c0 .853.685 1.538 1.538 1.538Zm8.121 0c.853 0 1.53-.685 1.53-1.538 0-.852-.677-1.538-1.53-1.538-.852 0-1.547.686-1.547 1.538 0 .853.695 1.538 1.547 1.538Z"
      fill={fill}
    />
  </Svg>
);

export default CartIcon;
