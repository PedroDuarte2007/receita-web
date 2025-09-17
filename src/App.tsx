import './App.css'
import { useState, useEffect } from 'react'

type Receita = {
  id: number;
  titulo: string;
  ingredientes: string[];
  modoPreparo: string;
  imagem: string;
};

function App() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [modalReceita, setModalReceita] = useState<Receita | null>(null);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novosIngredientes, setNovosIngredientes] = useState<string[]>([]);
  const [novoModoPreparo, setNovoModoPreparo] = useState('');
  const [novaImagem, setNovaImagem] = useState('');

  // Dados simulados de receitas
  useEffect(() => {
    const data = [
      {
        id: 94,
        titulo: "Miojo",
        ingredientes: ["M"],
        modoPreparo: "M",
        imagem: "https://ogimg.infoglobo.com.br/in/25191257-11f-f6a/FT1086A/95174042_RS-Rio-de-Janeiro-RJ-09-09-2021O-chef-Rafael-cavalieri-demonstra-versoes-melhoradas-do-m.jpg",
      },
      {
        id: 98,
        titulo: "Brigadeiro",
        ingredientes: ["Uma lata de brigadeiro pronto"],
        modoPreparo: "Abra a lata",
        imagem: "https://static.itdg.com.br/images/360-240/a373f494abb2c3360b9966f5abe130e2/brigadeiro-.jpg",
      },
      {
        id: 97,
        titulo: "Ovo frito",
        ingredientes: ["12 ovos"],
        modoPreparo: "Frite os ovos",
        imagem: "https://s2-receitas.glbimg.com/-3gVq-_w-zBEgZlnty0-HVhr00w=/0x0:237x212/984x0/smart/filters:strip_icc()/s.glbimg.com/po/rc/media/2014/01/23/22_16_39_163_images.jpg",
      },
      {
        id: 106,
        titulo: "Bolo Clash Royale",
        ingredientes: ["bolo", "clash royale"],
        modoPreparo: "saber fazer bolo, jogar clash royale",
        imagem: "https://i.pinimg.com/736x/db/fa/18/dbfa18309255be32153505ff93ce669d.jpg",
      },
      {
        id: 92,
        titulo: "mandioca",
        ingredientes: ["mandioca braba"],
        modoPreparo: "cozinhar",
        imagem: "https://saude.abril.com.br/wp-content/uploads/2016/12/mandioca.jpg?quality=50&strip=info",
      },
    ];
    setReceitas(data);
  }, []);

  // Função para excluir receita
  const excluirReceita = (id: number) => {
    setReceitas(receitas.filter((receita) => receita.id !== id));
  };

  // Função para abrir o modal de edição
  const editarReceita = (id: number) => {
    const receita = receitas.find((r) => r.id === id) || null;
    setModalReceita(receita);
    setNovoTitulo(receita?.titulo || '');
    setNovosIngredientes(receita?.ingredientes || []);
    setNovoModoPreparo(receita?.modoPreparo || '');
    setIsEditModal(true);
  };

  // Função para abrir o modal de criação
  const abrirModalCriacao = () => {
    setNovoTitulo('');
    setNovosIngredientes(['']);
    setNovoModoPreparo('');
    setNovaImagem('');
    setIsCreateModal(true);
  };

  // Função para salvar nova receita
  const salvarNovaReceita = () => {
    const novaReceita: Receita = {
      id: receitas.length + 1, // Gerar um ID simples
      titulo: novoTitulo,
      ingredientes: novosIngredientes,
      modoPreparo: novoModoPreparo,
      imagem: novaImagem,
    };

    setReceitas([...receitas, novaReceita]);
    setIsCreateModal(false);
  };

  // Função para salvar as edições
  const salvarReceitaEditada = () => {
    if (!modalReceita) return;

    const receitaEditada: Receita = {
      ...modalReceita,
      titulo: novoTitulo,
      ingredientes: novosIngredientes,
      modoPreparo: novoModoPreparo,
    };

    setReceitas(receitas.map((receita) =>
      receita.id === receitaEditada.id ? receitaEditada : receita
    ));
    setIsEditModal(false);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalReceita(null);
    setIsEditModal(false);
    setIsCreateModal(false);
  };

  return (
    <>
      <header>
        <h1>Receitas</h1>
      </header>
      <main>
        {receitas.map((receita) => (
          <div key={receita.id} className="card">
            <h2>{receita.titulo}</h2>
            <img src={receita.imagem} alt={receita.titulo} />
            <button onClick={() => setModalReceita(receita)}>Ver Receita</button>
            <button onClick={() => editarReceita(receita.id)}>Editar</button>
            <button onClick={() => excluirReceita(receita.id)}>Excluir</button>
          </div>
        ))}
        <div className="card nova-receita" onClick={abrirModalCriacao}>
          <h2>+</h2>
        </div>
      </main>

      {/* Modal */}
      {(modalReceita || isCreateModal) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditModal ? 'Editar Receita' : 'Ver Receita'}</h2>

            {isEditModal ? (
              <>
                <input
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                />
                <textarea
                  value={novoModoPreparo}
                  onChange={(e) => setNovoModoPreparo(e.target.value)}
                />
                <h3>Ingredientes:</h3>
                {novosIngredientes.map((ingrediente, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={ingrediente}
                    onChange={(e) => {
                      const newIngredientes = [...novosIngredientes];
                      newIngredientes[idx] = e.target.value;
                      setNovosIngredientes(newIngredientes);
                    }}
                  />
                ))}
                <button onClick={salvarReceitaEditada}>Salvar</button>
              </>
            ) : isCreateModal ? (
              <>
                <input
                  type="text"
                  placeholder="Título da Receita"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                />
                <textarea
                  placeholder="Modo de Preparo"
                  value={novoModoPreparo}
                  onChange={(e) => setNovoModoPreparo(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="URL da Imagem"
                  value={novaImagem}
                  onChange={(e) => setNovaImagem(e.target.value)}
                />
                <h3>Ingredientes:</h3>
                {novosIngredientes.map((ingrediente, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Ingrediente ${idx + 1}`}
                    value={ingrediente}
                    onChange={(e) => {
                      const newIngredientes = [...novosIngredientes];
                      newIngredientes[idx] = e.target.value;
                      setNovosIngredientes(newIngredientes);
                    }}
                  />
                ))}
                <button onClick={salvarNovaReceita}>Salvar Receita</button>
              </>
            ) : (
              <>
                <h3>Ingredientes:</h3>
                <ul>
                  {modalReceita?.ingredientes.map((ingrediente, idx) => (
                    <li key={idx}>{ingrediente}</li>
                  ))}
                </ul>
                <h3>Modo de Preparo:</h3>
                <p>{modalReceita?.modoPreparo}</p>
              </>
            )}
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      {isCreateModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Receita</h2>
            <input
              type="text"
              placeholder="Título"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
            <textarea
              placeholder="Modo de Preparo"
              value={novoModoPreparo}
              onChange={(e) => setNovoModoPreparo(e.target.value)}
            />
            <h3>Ingredientes:</h3>
            {novosIngredientes.map((ingrediente, idx) => (
              <input
                key={idx}
                type="text"
                placeholder="Ingrediente"
                value={ingrediente}
                onChange={(e) => {
                  const newIngredientes = [...novosIngredientes];
                  newIngredientes[idx] = e.target.value;
                  setNovosIngredientes(newIngredientes);
                }}
              />
            ))}
            <button onClick={() => setNovosIngredientes([...novosIngredientes, ''])}>
              Adicionar Ingrediente
            </button>
            <input
              type="text"
              placeholder="URL da Imagem"
              value={novaImagem}
              onChange={(e) => setNovaImagem(e.target.value)}
            />
            <button onClick={salvarNovaReceita}>Salvar</button>
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;