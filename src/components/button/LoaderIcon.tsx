import { forwardRef, Ref, SVGProps } from "react";

const LoaderIcon = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path d="M18.364 5.636 16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364Z" />
  </svg>
);
const ForwardRef = forwardRef(LoaderIcon);
export default ForwardRef;
