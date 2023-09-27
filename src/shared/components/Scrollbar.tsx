import SimpleBar from "simplebar-react";

//@ts-ignore
interface ScrollbarProps extends SimpleBar.Props {
  // interface ScrollbarProps extends SimpleBar.defaultProps {
  // interface ScrollbarProps {
  className?: string;
  style?: any;
  children?: any;
  scrollbarMaxSize?: number;
}

/* interface ScrollbarProps {
  className?: string;
  style?: any;
  children?: any;
} */

const Scrollbar = ({ className, style, children, scrollbarMaxSize, ...otherProps }: ScrollbarProps) => {
  return (
    <SimpleBar className={className} style={style} scrollbarMaxSize={scrollbarMaxSize} {...otherProps}>
      {children}
    </SimpleBar>
  );
};

export default Scrollbar;
