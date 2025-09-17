import './App.css'
import { useState, useEffect } from 'react'

type Receita = {
  id: number;
  nome: string;
  tipo?: string;
  ingredientes: string[];
  modoFazer: string;
  img: string;
  custoAproximado?: number;
};

function App() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [modalReceita, setModalReceita] = useState<Receita | null>(null);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [erroConexao, setErroConexao] = useState<string | null>(null);

  const [novoNome, setNovoNome] = useState('');
  const [novosIngredientes, setNovosIngredientes] = useState<string[]>(['']);
  const [novoModoFazer, setNovoModoFazer] = useState('');
  const [novaImg, setNovaImg] = useState('');
  const [novoTipo, setNovoTipo] = useState('');
  const [novoCusto, setNovoCusto] = useState<number>(0);

  // URL da API no Vercel
  const API_URL = 'https://receitasapi-b-2025.vercel.app/receitas';

  // Buscar todas as receitas
  const fetchReceitas = async () => {
    try {
      setErroConexao(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Erro ao buscar receitas: ${res.status}`);
      const data = await res.json();
      setReceitas(data);
    } catch (err) {
      console.error(err);
      setErroConexao('Não foi possível conectar à API. Verifique a URL.');
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, []);

  // Excluir receita
  const excluirReceita = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setReceitas(receitas.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      setErroConexao('Erro ao excluir a receita.');
    }
  };

  // Abrir modal de edição
  const editarReceita = (receita: Receita) => {
    setModalReceita(receita);
    setNovoNome(receita.nome);
    setNovosIngredientes(receita.ingredientes);
    setNovoModoFazer(receita.modoFazer);
    setNovaImg(receita.img);
    setNovoTipo(receita.tipo || '');
    setNovoCusto(receita.custoAproximado || 0);
    setIsEditModal(true);
  };

  // Salvar edição
  const salvarReceitaEditada = async () => {
    if (!modalReceita) return;
    const payload = {
      nome: novoNome,
      tipo: novoTipo,
      ingredientes: novosIngredientes,
      modoFazer: novoModoFazer,
      img: novaImg,
      custoAproximado: novoCusto,
    };

    try {
      await fetch(`${API_URL}/${modalReceita.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      fetchReceitas();
      setIsEditModal(false);
      setModalReceita(null);
    } catch (err) {
      console.error(err);
      setErroConexao('Erro ao editar a receita.');
    }
  };

  // Salvar nova receita
  const salvarNovaReceita = async () => {
    const payload = {
      nome: novoNome,
      tipo: novoTipo,
      ingredientes: novosIngredientes,
      modoFazer: novoModoFazer,
      img: novaImg,
      custoAproximado: novoCusto,
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      fetchReceitas();
      setIsCreateModal(false);
    } catch (err) {
      console.error(err);
      setErroConexao('Erro ao criar a receita.');
    }
  };

  const abrirModalCriacao = () => {
    setNovoNome('');
    setNovosIngredientes(['']);
    setNovoModoFazer('');
    setNovaImg('');
    setNovoTipo('');
    setNovoCusto(0);
    setIsCreateModal(true);
  };

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

      {erroConexao && <p style={{ color: 'red', textAlign: 'center' }}>{erroConexao}</p>}

      <main>
        {receitas.map((r) => (
          <div key={r.id} className="card">
            <h2>{r.nome}</h2>
            <img src={r.img} alt={r.nome} />
            <button onClick={() => setModalReceita(r)}>Ver Receita</button>
            <button onClick={() => editarReceita(r)}>Editar</button>
            <button onClick={() => excluirReceita(r.id)}>Excluir</button>
          </div>
        ))}
        <div className="card nova-receita" onClick={abrirModalCriacao}>
          <h2>+</h2>
        </div>
      </main>

      {(modalReceita || isCreateModal) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditModal ? 'Editar Receita' : isCreateModal ? 'Criar Receita' : 'Ver Receita'}</h2>

            {(isEditModal || isCreateModal) ? (
              <>
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Tipo (DOCE, SALGADA, BEBIDA)"
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value)}
                />
                <textarea
                  placeholder="Modo de Fazer"
                  value={novoModoFazer}
                  onChange={(e) => setNovoModoFazer(e.target.value)}
                />
                <h3>Ingredientes:</h3>
                {novosIngredientes.map((ing, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={ing}
                    onChange={(e) => {
                      const ingCopy = [...novosIngredientes];
                      ingCopy[idx] = e.target.value;
                      setNovosIngredientes(ingCopy);
                    }}
                  />
                ))}
                <button onClick={() => setNovosIngredientes([...novosIngredientes, ''])}>
                  Adicionar Ingrediente
                </button>
                <input
                  type="text"
                  placeholder="URL da Imagem"
                  value={novaImg}
                  onChange={(e) => setNovaImg(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Custo Aproximado"
                  value={novoCusto}
                  onChange={(e) => setNovoCusto(Number(e.target.value))}
                />
                <button onClick={isEditModal ? salvarReceitaEditada : salvarNovaReceita}>
                  Salvar
                </button>
              </>
            ) : (
              <>
                <h3>Ingredientes:</h3>
                <ul>{modalReceita?.ingredientes.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                <h3>Modo de Fazer:</h3>
                <p>{modalReceita?.modoFazer}</p>
              </>
            )}
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
