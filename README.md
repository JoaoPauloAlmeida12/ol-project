# Clínica — gestão integrada

Etapa 1: painel em português, navegação dos módulos e arquitetura de autenticação/autorização com Supabase. Nenhum dado de paciente é incluído.

Consulte [implantação, contratos e pendências](docs/etapa-1.md) e respeite [AGENTS.md](AGENTS.md). O banco e os segredos são gerenciados pelo [Lovable](https://lovable.dev/projects/90288362-2540-4a42-b647-254efbd3864e).

```sh
npm ci
npm run dev
```

Sem configuração Supabase, o painel permanece disponível e os módulos ficam bloqueados. Não há sessão de demonstração. Não usar com dados clínicos reais antes da configuração e validação das políticas no backend.
