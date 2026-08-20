const messages: Record<string, string> = {
  configuration: "A autenticação ainda está a ser configurada. Tente novamente em breve.",
  credentials: "Email ou palavra-passe incorretos.",
  email_pending: "Conta criada. Confirme o email antes de iniciar sessão.",
  expired: "O link é inválido ou expirou. Peça um novo link.",
  generic: "Não foi possível concluir o pedido. Tente novamente.",
  invalid: "Revise os dados assinalados e tente novamente.",
  organization_exists: "Este identificador de empresa já está em uso.",
  recovery_sent: "Se existir uma conta com esse email, enviámos as instruções de recuperação.",
  updated: "Palavra-passe atualizada com sucesso.",
};

export function authMessage(code: string | string[] | undefined): string | null {
  const key = Array.isArray(code) ? code[0] : code;
  return key ? messages[key] ?? null : null;
}
