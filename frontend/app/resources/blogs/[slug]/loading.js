import Loader from "../../../components/Loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader size="lg" color="primary" />
    </div>
  );
}
