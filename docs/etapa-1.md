# Etapa 1 — implantação

## Entrega verificável

Painel público sem dados clínicos, navegação responsiva, seis páginas de módulo, login por e-mail/senha do Supabase e saída de sessão. As páginas de módulo validam o usuário remotamente e consultam autorização antes de mostrar o estado de preparação. Nenhum CRUD, indicador, paciente ou transação é simulado. Os traços nos indicadores significam indisponibilidade, não zero.

## Configuração pelo Lovable

O AGENTS.md reserva banco, arquivos gerados e segredos ao Lovable. Nenhuma migração foi criada. Solicitar no editor Lovable:

1. Conectar o projeto Supabase e configurar `VITE_SUPABASE_URL` (HTTPS) e `VITE_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_...`). São configurações públicas do navegador, embutidas no build. Recompilar após configurar. Chaves legadas JWT não são aceitas para evitar configuração acidental de service_role. Nunca fornecer chaves secretas/service_role ao frontend ou ao Git.
2. Habilitar autenticação por senha, provisionar contas e configurar política de senhas e limites de tentativas. Cadastro público, recuperação de senha, OAuth e callbacks não fazem parte desta etapa.
3. Implementar a RPC `public.can_access_module(requested_module text) returns boolean`. Ela deve usar `auth.uid()` e associações confiáveis de usuário, clínica ativa e permissões mantidas pelo administrador. Nunca aceitar usuário, papel ou clínica do cliente como prova de autorização, nem ler papel de `user_metadata`. Negar usuários anônimos, módulos desconhecidos e usuários sem vínculo. Retornar o booleano `true` somente para acesso autorizado; outros valores são negados.
4. Identificadores aceitos: `pacientes`, `agenda`, `prontuarios`, `documentos`, `financeiro`, `configuracoes`. Definir matriz de permissões com o responsável da clínica (sem conceder administrador por padrão).
5. Antes de operações de dados: criar esquema via Lovable, habilitar RLS em todas as tabelas expostas, políticas por clínica/usuário e operação, políticas de Storage e privilégios mínimos. Revisar funções SECURITY DEFINER, search_path e grants. Validar isolamento entre clínicas, revogação de permissões e acesso direto à API com contas de teste sintéticas.

## Limites de segurança

O guard React controla somente apresentação/navegação. Não protege banco ou API. A autorização real precisa ser aplicada pelo Supabase em cada operação com RLS e privilégios de banco. Nenhuma API clínica ou dado sensível é carregado nesta etapa, inclusive no SSR. Ausência de configuração, sessão inválida, RPC ausente, falha de rede ou retorno diferente de `true` mantém o módulo bloqueado. A sessão é reavaliada a cada montagem, evento de autenticação e retorno de foco; isso não substitui validação a cada operação no backend.

A visão geral é pública propositalmente, mostra apenas conteúdo estático de implantação. O status “Estrutura inicial” não representa conexão ou certificação de segurança. O checklist registra pendências da entrega e não detecta automaticamente a configuração de produção. O cliente Supabase só é criado no navegador; não há singleton de sessão compartilhado entre requisições SSR. Sessões persistem no armazenamento padrão do SDK: avaliar política de sessão, CSP, MFA e dispositivos compartilhados antes do uso real. Não usar com pacientes reais antes da validação do backend.

## Desenvolvimento e validação

Node 22+ e npm. O lockfile npm permite instalação reproduzível com `npm ci`; `bun.lock` original é preservado, mas não foi atualizado. Para estas alterações, usar npm (não alternar instaladores sem atualizar o lockfile correspondente).

```sh
npm ci
npm run dev
npm test
npm run lint
npx tsc --noEmit
npm run build
```

O TanStack gera `src/routeTree.gen.ts` ao iniciar/buildar. Nunca editar esse arquivo manualmente. Testes de autenticação usam um cliente mockado, sem contas reais e sem afirmar validação do Supabase remoto. Testes de integração reais exigem o ambiente configurado e as políticas acima.
