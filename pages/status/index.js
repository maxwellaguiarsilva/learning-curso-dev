import useSWR from "swr";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

function JsonSyntaxHighlighter({ data }) {
  return (
    <SyntaxHighlighter language="json">
      {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Status() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10000,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  return (
    <div style={{ "font-family": "Source Code Pro" }}>
      <h1>Status</h1>
      {data && <JsonSyntaxHighlighter data={data} />}
    </div>
  );
}
