interface ResponseProps {
  status: number;
  title: string;
}

export default function Res({ status, title }: ResponseProps) {
  return {
    status: status,
    message: title,
  };
}
