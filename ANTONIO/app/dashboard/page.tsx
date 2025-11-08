'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Document } from '@/lib/supabase';

// Componente recursivo para renderizar documentos em hierarquia
function DocumentItem({
  doc,
  level,
  selectedDocId,
  setSelectedDocId,
  deleteDocument,
  expandedDocs,
  toggleExpand,
  getSubpages,
}: {
  doc: Document;
  level: number;
  selectedDocId: string | null;
  setSelectedDocId: (id: string) => void;
  deleteDocument: (id: string) => void;
  expandedDocs: Set<string>;
  toggleExpand: (id: string) => void;
  getSubpages: (parentId: string) => Document[];
}) {
  const subpages = getSubpages(doc.id);
  const hasSubpages = subpages.length > 0;
  const isExpanded = expandedDocs.has(doc.id);
  const paddingLeft = `${level * 12}px`;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors ${
          selectedDocId === doc.id
            ? 'bg-gray-200 text-gray-900'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `calc(0.75rem + ${paddingLeft})` }}
      >
        {/* Botão Expandir/Colapsar */}
        {hasSubpages ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(doc.id);
            }}
            className="p-0.5 hover:bg-gray-300 rounded"
            title={isExpanded ? 'Colapsar' : 'Expandir'}
            aria-label={isExpanded ? 'Colapsar subpáginas' : 'Expandir subpáginas'}
          >
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Ícone de Página */}
        <span className="text-gray-400">📄</span>

        {/* Botão do Documento */}
        <button
          onClick={() => setSelectedDocId(doc.id)}
          className="flex-1 text-left min-w-0"
        >
          <div className={`truncate ${selectedDocId === doc.id ? 'font-medium' : ''}`}>
            {doc.title || 'Sem título'}
          </div>
        </button>

        {/* Botão Deletar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteDocument(doc.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
          title="Deletar documento"
        >
          <svg
            className="w-3.5 h-3.5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Subpáginas (renderização recursiva) */}
      {hasSubpages && isExpanded && (
        <div className="mt-0.5">
          {subpages.map((subpage) => (
            <DocumentItem
              key={subpage.id}
              doc={subpage}
              level={level + 1}
              selectedDocId={selectedDocId}
              setSelectedDocId={setSelectedDocId}
              deleteDocument={deleteDocument}
              expandedDocs={expandedDocs}
              toggleExpand={toggleExpand}
              getSubpages={getSubpages}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  
  // Estados do editor
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  
  // Estados do comando "/"
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPosition, setBlockMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [slashPosition, setSlashPosition] = useState<number | null>(null);
  
  // Estados do Preview Markdown
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Estados do modo de visualização (novo!)
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  
  // Estados da hierarquia
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

  // Definição dos blocos disponíveis
  const blockTypes = [
    { id: 'h1', label: 'Título 1', icon: '📝', template: '# ' },
    { id: 'h2', label: 'Título 2', icon: '📄', template: '## ' },
    { id: 'h3', label: 'Título 3', icon: '📃', template: '### ' },
    { id: 'list', label: 'Lista com marcadores', icon: '•', template: '• ' },
    { id: 'numbered', label: 'Lista numerada', icon: '1.', template: '1. ' },
    { id: 'quote', label: 'Citação', icon: '💬', template: '> ' },
    { id: 'divider', label: 'Divisor', icon: '—', template: '\n---\n' },
    { id: 'page', label: 'Subpágina', icon: '📄', template: '', action: 'createSubpage' },
  ];

  useEffect(() => {
    // Verificar autenticação e carregar documentos
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/');
      } else {
        setUserEmail(session.user.email || '');
        loadDocuments();
        setIsLoading(false);
      }
    });
  }, [router]);

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar documentos:', error);
      return;
    }

    setDocuments(data || []);
  };

  const createNewDocument = async (parentId: string | null = null) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          user_id: session.user.id,
          title: 'Sem título',
          content: '',
          parent_id: parentId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar documento:', error);
      return;
    }

    if (data) {
      setDocuments([...documents, data]);
      setSelectedDocId(data.id);
      
      // Se tem parent, expandir o parent automaticamente
      if (parentId) {
        setExpandedDocs(prev => new Set(prev).add(parentId));
      }
    }
  };

  // Criar subpágina do documento atual
  const createSubpage = async () => {
    if (!selectedDocId) return;
    await createNewDocument(selectedDocId);
  };

  // Toggle expandir/colapsar documento
  const toggleExpand = (docId: string) => {
    setExpandedDocs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  // Organizar documentos em hierarquia
  const getDocumentTree = () => {
    const rootDocs = documents.filter(doc => !doc.parent_id);
    return rootDocs;
  };

  // Pegar subpáginas de um documento
  const getSubpages = (parentId: string) => {
    return documents.filter(doc => doc.parent_id === parentId);
  };

  // Obter o caminho completo (breadcrumbs) de um documento
  const getBreadcrumbs = (docId: string | null): Document[] => {
    if (!docId) return [];
    
    const breadcrumbs: Document[] = [];
    let currentDoc = documents.find(d => d.id === docId);
    
    while (currentDoc) {
      breadcrumbs.unshift(currentDoc);
      if (currentDoc.parent_id) {
        currentDoc = documents.find(d => d.id === currentDoc!.parent_id);
      } else {
        currentDoc = undefined;
      }
    }
    
    return breadcrumbs;
  };

  const deleteDocument = async (docId: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este documento?');
    
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', docId);

    if (error) {
      console.error('Erro ao deletar documento:', error);
      return;
    }

    // Remover da lista
    setDocuments(documents.filter((doc) => doc.id !== docId));
    
    // Se era o documento selecionado, limpar seleção
    if (selectedDocId === docId) {
      setSelectedDocId(null);
      setTitle('');
      setContent('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Função para detectar "/" e mostrar menu de blocos
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setContent(newContent);

    // Verificar se digitou "/" no início de uma linha ou após espaço
    const textBeforeCursor = newContent.substring(0, cursorPosition);
    const lastChar = textBeforeCursor[textBeforeCursor.length - 1];
    const charBeforeLast = textBeforeCursor[textBeforeCursor.length - 2];
    
    if (lastChar === '/' && (!charBeforeLast || charBeforeLast === '\n' || charBeforeLast === ' ')) {
      setSlashPosition(cursorPosition - 1);
      setShowBlockMenu(true);
      setSelectedBlockIndex(0);
    } else if (showBlockMenu) {
      setShowBlockMenu(false);
    }
  };

  // Função para inserir bloco selecionado
  const insertBlock = async (block: typeof blockTypes[0]) => {
    if (slashPosition === null) return;

    // Se for o comando /page, criar subpágina
    if (block.id === 'page') {
      setShowBlockMenu(false);
      setSlashPosition(null);
      setSelectedBlockIndex(0);
      
      // Remover o "/" do texto
      const before = content.substring(0, slashPosition);
      const after = content.substring(slashPosition + 1);
      setContent(before + after);
      
      // Criar subpágina
      await createSubpage();
      return;
    }

    // Remover o "/" e inserir o template do bloco
    const before = content.substring(0, slashPosition);
    const after = content.substring(slashPosition + 1);
    const newContent = before + block.template + after;

    setContent(newContent);
    setShowBlockMenu(false);
    setSlashPosition(null);
    setSelectedBlockIndex(0);

    // Focar o textarea depois de inserir (setTimeout para garantir que o conteúdo foi atualizado)
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const newCursorPosition = before.length + block.template.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  // Função para lidar com teclas no menu de blocos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showBlockMenu) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedBlockIndex((prev) => (prev + 1) % blockTypes.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedBlockIndex((prev) => (prev - 1 + blockTypes.length) % blockTypes.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      insertBlock(blockTypes[selectedBlockIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowBlockMenu(false);
      setSlashPosition(null);
    }
  };

  // Função para converter Markdown em HTML
  const renderMarkdown = (markdown: string): string => {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Blockquote
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />');
    
    // Lista com marcadores
    html = html.replace(/^• (.+)$/gm, '<li>$1</li>');
    
    // Lista numerada
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
    
    // Envolver listas em <ul> ou <ol>
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      return `<ul>${match}</ul>`;
    });
    
    // Negrito
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Itálico
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Code inline
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // Quebras de linha
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  // Carregar documento selecionado
  useEffect(() => {
    const selectedDoc = documents.find((doc) => doc.id === selectedDocId);
    if (selectedDoc) {
      setTitle(selectedDoc.title);
      setContent(selectedDoc.content);
      setSaveStatus('saved');
    }
  }, [selectedDocId, documents]);

  // Auto-save com debounce
  useEffect(() => {
    if (!selectedDocId) return;

    const selectedDoc = documents.find((doc) => doc.id === selectedDocId);
    
    // Só salvar se houve mudança
    if (
      selectedDoc &&
      (selectedDoc.title !== title || selectedDoc.content !== content)
    ) {
      setSaveStatus('saving');
      
      const timeoutId = setTimeout(async () => {
        await saveDocument();
      }, 2000); // 2 segundos de debounce

      return () => clearTimeout(timeoutId);
    }
  }, [title, content, selectedDocId]);

  const saveDocument = async () => {
    if (!selectedDocId) return;

    setIsSaving(true);

    const { error } = await supabase
      .from('documents')
      .update({
        title: title,
        content: content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedDocId);

    if (error) {
      console.error('Erro ao salvar documento:', error);
      setSaveStatus('idle');
    } else {
      setSaveStatus('saved');
      // Atualizar lista de documentos
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === selectedDocId
            ? { ...doc, title, content, updated_at: new Date().toISOString() }
            : doc
        )
      );
    }

    setIsSaving(false);
  };

  const selectedDoc = documents.find((doc) => doc.id === selectedDocId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900 mb-1">
            Notion Clone
          </h1>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>

        {/* Botão Novo Documento */}
        <div className="p-3">
          <button
            onClick={() => createNewDocument(null)}
            className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            + Novo Documento
          </button>
        </div>

        {/* Lista de Documentos com Hierarquia */}
        <div className="flex-1 overflow-y-auto px-2">
          {documents.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              Nenhum documento ainda.
              <br />
              Crie o primeiro!
            </div>
          ) : (
            <div className="space-y-1">
              {getDocumentTree().map((doc) => (
                <DocumentItem
                  key={doc.id}
                  doc={doc}
                  level={0}
                  selectedDocId={selectedDocId}
                  setSelectedDocId={setSelectedDocId}
                  deleteDocument={deleteDocument}
                  expandedDocs={expandedDocs}
                  toggleExpand={toggleExpand}
                  getSubpages={getSubpages}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botão Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL - EDITOR */}
      <div className="flex-1 overflow-y-auto">
        {selectedDoc ? (
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Breadcrumbs */}
            {getBreadcrumbs(selectedDocId).length > 1 && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                {getBreadcrumbs(selectedDocId).map((doc, index, array) => (
                  <div key={doc.id} className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocId(doc.id)}
                      className="hover:text-gray-900 transition-colors"
                    >
                      {doc.title || 'Sem título'}
                    </button>
                    {index < array.length - 1 && (
                      <span className="text-gray-300">/</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Barra de Controles */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {/* Toggle de 3 Modos: Editar | Split | Preview */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'edit'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Modo Edição"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'split'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Modo Split (Edição + Preview)"
                  >
                    ⚡ Split
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Modo Preview"
                  >
                    👁️ Preview
                  </button>
                </div>

                {/* Botão Criar Subpágina */}
                <button
                  onClick={createSubpage}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                  title="Criar subpágina"
                >
                  <span>+</span>
                  <span>Subpágina</span>
                </button>
              </div>

              {/* Status de salvamento */}
              <span
                className={`text-sm ${
                  saveStatus === 'saving'
                    ? 'text-yellow-600'
                    : saveStatus === 'saved'
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                {saveStatus === 'saving' && '💾 Salvando...'}
                {saveStatus === 'saved' && '✓ Salvo'}
                {saveStatus === 'idle' && ''}
              </span>
            </div>

            {/* MODO SPLIT: Editor + Preview Lado a Lado */}
            {viewMode === 'split' ? (
              <div className="flex gap-6 h-[calc(100vh-240px)]">
                {/* Painel Esquerdo: Editor */}
                <div className="flex-1 flex flex-col border-r border-gray-200 pr-6">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sem título"
                    className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none focus:outline-none mb-4"
                  />
                  <div className="relative flex-1">
                    <textarea
                      value={content}
                      onChange={handleContentChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Comece a escrever ou digite '/' para comandos..."
                      className="w-full h-full text-base text-gray-700 placeholder-gray-400 border-none outline-none focus:outline-none resize-none"
                      style={{ lineHeight: '1.75' }}
                    />
                    {/* Menu de Blocos */}
                    {showBlockMenu && (
                      <div className="absolute left-0 top-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="p-2">
                          <div className="text-xs text-gray-500 px-2 py-1 mb-1">
                            Blocos básicos
                          </div>
                          {blockTypes.map((block, index) => (
                            <button
                              key={block.id}
                              onClick={() => insertBlock(block)}
                              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                                index === selectedBlockIndex
                                  ? 'bg-blue-50 text-blue-900'
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="text-xl">{block.icon}</span>
                              <span className="text-sm font-medium">{block.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                          ↑↓ para navegar • Enter para selecionar • Esc para fechar
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Painel Direito: Preview Live */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {title || 'Sem título'}
                  </h1>
                  <div 
                    className="markdown-preview text-base text-gray-700"
                    style={{ lineHeight: '1.75' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                  />
                </div>
              </div>
            ) : (
              /* MODO EDIT ou MODO PREVIEW */
              <>
                {/* Campo de Título */}
                {viewMode === 'edit' ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sem título"
                    className="w-full text-4xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none focus:outline-none mb-4"
                  />
                ) : (
                  <h1 className="w-full text-4xl font-bold text-gray-900 mb-4">
                    {title || 'Sem título'}
                  </h1>
                )}

                {/* Conteúdo: Edição ou Preview */}
                {viewMode === 'edit' ? (
                  <div className="relative">
                    <textarea
                      value={content}
                      onChange={handleContentChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Comece a escrever ou digite '/' para comandos..."
                      className="w-full min-h-[500px] text-base text-gray-700 placeholder-gray-400 border-none outline-none focus:outline-none resize-none"
                      style={{ lineHeight: '1.75' }}
                    />
                    {/* Menu de Blocos */}
                    {showBlockMenu && (
                      <div className="absolute left-0 top-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <div className="p-2">
                          <div className="text-xs text-gray-500 px-2 py-1 mb-1">
                            Blocos básicos
                          </div>
                          {blockTypes.map((block, index) => (
                            <button
                              key={block.id}
                              onClick={() => insertBlock(block)}
                              className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                                index === selectedBlockIndex
                                  ? 'bg-blue-50 text-blue-900'
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="text-xl">{block.icon}</span>
                              <span className="text-sm font-medium">{block.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                          ↑↓ para navegar • Enter para selecionar • Esc para fechar
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="markdown-preview w-full min-h-[500px] text-base text-gray-700"
                    style={{ lineHeight: '1.75' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <svg
                className="mx-auto h-16 w-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-medium mb-2">Selecione um documento</p>
              <p className="text-sm">ou crie um novo para começar a escrever</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
