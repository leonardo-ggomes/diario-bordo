# 🧭 Diário de Bordo

**Plataforma Avançada de Mapeamento de Clima Organizacional e Governança Ativa**

O **Diário de Bordo** é uma aplicação web voltada para a gestão e o monitoramento do bem-estar e clima de equipes institucionais ou corporativas. Através de uma interface minimalista e acolhedora, colaboradores/alunos podem registrar seus humores e contextos semanais, enquanto administradores possuem um console robusto para análise de dados e tomada de decisão.

---

## ✨ Funcionalidades

### 👤 Para o Usuário (Colaborador / Aluno)
* **Acesso Simplificado:** Login sem senhas complexas, utilizando apenas Nome e E-mail Institucional.
* **Registro de Clima:** Avaliação de humor semanal de forma intuitiva.
* **Marcadores Dinâmicos:** Seleção de tags de contexto (ex: Carga Horária, Liderança) para complementar o feedback.
* **Dashboard Pessoal:** Histórico de submissões e contador de "ofensivas" (streaks) para incentivar o engajamento contínuo.

### 👑 Para a Governança (Administrador)
* **Console Analítico:** Painel com indicadores-chave (KPIs) como Índice Médio de Humor e total de amostras coletadas.
* **Gráficos em Tempo Real:** Distribuição do clima via gráficos gerados com Google Charts.
* **Filtros Avançados:** Buscas refinadas por nome do colaborador ou nível específico de humor.
* **Controle de Coleta:** Botão interativo (Ativar/Pausar) para abrir ou fechar a janela de submissão de feedbacks.
* **Gestão de Marcadores (Tags):** Interface dedicada para criar e remover as tags que os usuários utilizam no preenchimento.
* **Auditoria:** Tabela completa com histórico de registros, data, humor, tags e notas de contexto.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma stack moderna e focada em performance e design:

**Frontend**
* [HTML5 / EJS](https://ejs.co/) - Motores de template dinâmicos.
* [Tailwind CSS](https://tailwindcss.com/) - Estilização utilitária de alta performance e responsividade.
* [Phosphor Icons](https://phosphoricons.com/) - Biblioteca de ícones premium e minimalistas.
* [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) - Tipografia oficial do projeto.
* [Google Charts](https://developers.google.com/chart) - Renderização de gráficos analíticos.

**Backend & Dados**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Servidor web e roteamento.
* [Sequelize](https://sequelize.org/) - ORM para comunicação com o banco de dados.
* [MySQL](https://www.mysql.com/) - Banco de dados relacional.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **MySQL** instalados em sua máquina.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/diario-de-bordo.git](https://github.com/seu-usuario/diario-de-bordo.git)
