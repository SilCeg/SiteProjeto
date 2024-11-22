const apiBaseUrl = "http://localhost:3031";

// Detecta a página atual
const currentPage = window.location.pathname;

// Lógica para a página index.html
if (currentPage.includes("index.html")) {
  // Função para carregar a lista de alunos
  const carregarAlunos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/mostrar`);
      const alunos = response.data;
      const tableBody = document.getElementById("alunoTableBody");
      tableBody.innerHTML = "";
      alunos.forEach(aluno => {
        tableBody.innerHTML += `
          <tr>
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.atividade}</td>
            <td>
              <a href="edit.html?id=${aluno.id}" class="btn btn-warning btn-sm">Editar</a>
              <button class="btn btn-danger btn-sm" onclick="deletarAluno(${aluno.id})">Deletar</button>
              
            </td>
          </tr>
        `;
      });
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  // Função para deletar aluno
  const deletarAluno = async (id) => {
    if (confirm("Tem certeza que deseja deletar este aluno?")) {
      try {
        await axios.get(`${apiBaseUrl}/deletar/${id}`);
        alert("Aluno deletado com sucesso!");
        carregarAlunos();
      } catch (error) {
        console.error("Erro ao deletar aluno:", error);
      }
    }
  };

  // Carrega alunos ao abrir a página
  carregarAlunos();
}

// Lógica para a página editar.html
if (currentPage.includes("editar.html")) {
  // Função para carregar os dados do aluno para edição
  const carregarAluno = async (id) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/mostrar`);
      const aluno = response.data.find(aluno => aluno.id == id);

      if (aluno) {
        document.getElementById("alunoId").value = aluno.id;
        document.getElementById("nome").value = aluno.nome;
        document.getElementById("idade").value = aluno.idade;
        document.getElementById("atividade").value = aluno.atividade;
      }
    } catch (error) {
      console.error("Erro ao carregar aluno:", error);
    }
  };

  // Função para salvar as alterações do aluno
  document.getElementById("alunoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("alunoId").value;
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const atividade = document.getElementById("atividade").value;

    try {
      await axios.get(`${apiBaseUrl}/editar/${id}/${nome}/${idade}/${atividade}`);
      alert("Aluno atualizado com sucesso!");
      window.location.href = "index.html"; // Redireciona para a lista
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    }
  });

  // Verifica se há um ID na URL para carregar os dados do aluno
  const urlParams = new URLSearchParams(window.location.search);
  const alunoId = urlParams.get("id");

  if (alunoId) {
    carregarAluno(alunoId);
  }
}

// Lógica para a página cadastro.html
if (currentPage.includes("cadastro.html")) {
  // Função para cadastrar um novo aluno
  document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const atividade = document.getElementById("atividade").value;

    try {
      await axios.get(`${apiBaseUrl}/salvar/${nome}/${idade}/${atividade}`);
      alert("Aluno cadastrado com sucesso!");
      window.location.href = "index.html"; // Redireciona para a lista
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  });
}
