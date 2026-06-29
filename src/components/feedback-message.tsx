type FeedbackMessageProps = {
  success?: string;
  error?: string;
};

const errorMessages: Record<string, string> = {
  required: "Preencha todos os campos obrigatórios.",
  invalid: "Os dados enviados não pertencem a esta barbearia.",
  slug: "Informe um slug válido.",
  taken: "Esse horário já está ocupado para o barbeiro escolhido.",
};

export function FeedbackMessage({ success, error }: FeedbackMessageProps) {
  if (success) {
    return (
      <div className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
        Operação concluída com sucesso.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">
        {errorMessages[error] ?? "Não foi possível concluir a operação."}
      </div>
    );
  }

  return null;
}
