interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="px-4 bg-slate-50 w-full h-full overflow-y-auto">
      <section >{children}</section>
    </div>
  );
};

export default Container;
