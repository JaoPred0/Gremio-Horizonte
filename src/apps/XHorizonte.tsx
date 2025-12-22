// Arrumar para pegar o IP



import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, ScrollText } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { formatUserName } from '@/utils/formatUserName';
import { getUserRole } from '@/data/roles';
import { roleIcons } from '@/utils/roleIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';

// Tipos
interface User {
  name: string;
  email: string;
  role: {
    key: string;
    label: string;
    color: string;
  };
}

interface Comment {
  user: User;
  content: string;
  timestamp: Date;
  likes: string[];
}

interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  likes: string[];
  comments: Comment[];
}

export const XHorizonte: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState({
    terms: false,
    responsibility: false,
    rules: false
  });
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [fullNameConfirmation, setFullNameConfirmation] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const accepted = localStorage.getItem('xhorizonte_terms_accepted');
    if (accepted === 'true') {
      setHasAcceptedTerms(true);
    } else {
      setShowTermsModal(true);
    }
  }, []);

  const allTermsAccepted = termsAccepted.terms && termsAccepted.responsibility && termsAccepted.rules;

  const handleAcceptAll = () => {
    setTermsAccepted({
      terms: true,
      responsibility: true,
      rules: true
    });
  };

  const handleConfirmTerms = async () => {
    if (allTermsAccepted && fullNameConfirmation.trim() && currentUser) {
      try {
        // Salvar confirmação no Firebase
        await addDoc(collection(db, 'terms_confirmations'), {
          userEmail: currentUser.email,
          userName: currentUser.name,
          fullNameTyped: fullNameConfirmation.trim(),
          acceptedAt: serverTimestamp(),
          termsVersion: '1.0',
          ipAddress: 'N/A'
        });

        localStorage.setItem('xhorizonte_terms_accepted', 'true');
        setHasAcceptedTerms(true);
        setShowTermsModal(false);
      } catch (error) {
        console.error('Erro ao salvar confirmação:', error);
        alert('Erro ao salvar confirmação. Tente novamente.');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const userRole = getUserRole(firebaseUser.email);
        setCurrentUser({
          name: formatUserName(firebaseUser.email),
          email: firebaseUser.email,
          role: userRole
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar posts do Firebase
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();

        // Garantir que o user tenha role
        const user = data.user || {};
        if (!user.role) {
          user.role = getUserRole(user.email);
        }

        // Garantir que os comentários tenham role
        const comments = (data.comments || []).map((comment: any) => {
          if (!comment.user.role) {
            comment.user.role = getUserRole(comment.user.email);
          }
          return comment;
        });

        return {
          id: doc.id,
          ...data,
          user,
          comments,
          timestamp: (data.timestamp as Timestamp)?.toDate() || new Date()
        };
      }) as Post[];
      setPosts(postsData);
    }, (error) => {
      console.error('Erro ao carregar posts:', error);
    });

    return () => unsubscribe();
  }, []);

  // Criar novo post
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !currentUser || !hasAcceptedTerms) return;

    try {
      await addDoc(collection(db, 'posts'), {
        user: currentUser,
        content: newPostContent,
        timestamp: serverTimestamp(),
        likes: [],
        comments: []
      });
      setNewPostContent('');
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  // Curtir post
  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const hasLiked = post.likes?.includes(currentUser.email);

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: hasLiked ? arrayRemove(currentUser.email) : arrayUnion(currentUser.email)
      });
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  // Toggle comentários
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Adicionar comentário
  const handleComment = async (postId: string) => {
    if (!currentUser || !hasAcceptedTerms) return;

    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const newComment: Comment = {
      user: currentUser,
      content: commentText,
      timestamp: new Date(),
      likes: []
    };

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  // Curtir comentário
  const handleLikeComment = async (postId: string, commentIndex: number) => {
    if (!currentUser) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments[commentIndex];
    const hasLiked = comment.likes?.includes(currentUser.email);

    try {
      const updatedComments = [...post.comments];
      updatedComments[commentIndex] = {
        ...comment,
        likes: hasLiked
          ? comment.likes.filter(u => u !== currentUser.email)
          : [...(comment.likes || []), currentUser.email]
      };

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: updatedComments
      });
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    }
  };

  const formatTime = (date: Date | any): string => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : (date?.toDate ? date.toDate() : new Date(date));
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="min-h-screen bg-base-100">{/* Modal de Termos */}
      {showTermsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
                >
                  <span className="text-3xl"><ScrollText className="w-8 h-8" /></span>
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bem-vindo ao XHorizonte
                </h2>
                <p className="text-sm opacity-70 mt-2">Por favor, leia e aceite os termos antes de continuar</p>
              </div>

              {/* Regras */}
              <div className="bg-base-200 rounded-xl p-6 mb-6 space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="text-2xl">⚖️</span>
                  Regras da Plataforma
                </h3>

                <ul className="space-y-2 text-sm opacity-80">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      O respeito é obrigatório. Não será tolerado discurso de ódio,
                      preconceito ou ataques a qualquer grupo, incluindo a comunidade LGBTQIA+.
                    </span>
                  </li>

                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Discussões e debates são permitidos, desde que não evoluam para
                      agressões, ameaças, incentivo à violência ou assédio.
                    </span>
                  </li>

                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      É proibido publicar conteúdos que incentivem automutilação,
                      suicídio, ou exponham traumas pessoais de forma sensível.
                    </span>
                  </li>

                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Não publique conteúdos ilegais, difamatórios ou que possam
                      comprometer a imagem da instituição.
                    </span>
                  </li>

                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      Não compartilhe dados pessoais seus ou de terceiros
                      (telefones, endereços, documentos, etc.).
                    </span>
                  </li>

                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      O uso da plataforma deve contribuir para um ambiente seguro,
                      educativo e saudável para todos.
                    </span>
                  </li>
                </ul>
              </div>


              {/* Checkboxes */}
              <div className="space-y-4 mb-6">
                {/* Aceitar Tudo */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border-2 border-primary/20"
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mt-1"
                      checked={allTermsAccepted}
                      onChange={handleAcceptAll}
                    />
                    <div className="flex-1">
                      <span className="font-bold text-lg">Aceitar Tudo</span>
                      <p className="text-xs opacity-70 mt-1">Marque para aceitar todos os termos de uma vez</p>
                    </div>
                  </label>
                </motion.div>

                {/* Termos individuais */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-base-200 rounded-xl p-4"
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mt-1"
                      checked={termsAccepted.terms}
                      onChange={(e) => setTermsAccepted({ ...termsAccepted, terms: e.target.checked })}
                    />
                    <div className="flex-1">
                      <span className="font-semibold">Li e aceito os Termos de Uso</span>
                      <p className="text-xs opacity-70 mt-1">Concordo em seguir as diretrizes da plataforma</p>
                    </div>
                  </label>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-base-200 rounded-xl p-4"
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mt-1"
                      checked={termsAccepted.responsibility}
                      onChange={(e) => setTermsAccepted({ ...termsAccepted, responsibility: e.target.checked })}
                    />
                    <div className="flex-1">
                      <span className="font-semibold">Assumo responsabilidade pelos meus comentários</span>
                      <p className="text-xs opacity-70 mt-1">Sou responsável por tudo que publico na plataforma</p>
                    </div>
                  </label>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-base-200 rounded-xl p-4"
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mt-1"
                      checked={termsAccepted.rules}
                      onChange={(e) => setTermsAccepted({ ...termsAccepted, rules: e.target.checked })}
                    />
                    <div className="flex-1">
                      <span className="font-semibold">Comprometo-me a seguir as regras</span>
                      <p className="text-xs opacity-70 mt-1">Respeitarei todas as normas da comunidade</p>
                    </div>
                  </label>
                </motion.div>
              </div>

              {/* Confirmação de Nome Completo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-warning/10 border-2 border-warning rounded-xl p-4 mb-6"
              >
                <div className="flex gap-2 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-warning">Confirmação Obrigatória</h4>
                    <p className="text-xs opacity-80 mt-1">
                      Para sua segurança e responsabilização legal, digite seu nome completo abaixo.
                      <strong className="block mt-2">Importante:</strong> Caso não digite, o desenvolvedor terá acesso ao seu email institucional e poderá identificá-lo. É recomendável preencher corretamente para confirmar sua ciência dos termos.
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Digite seu nome completo aqui"
                  className="input input-bordered w-full"
                  value={fullNameConfirmation}
                  onChange={(e) => setFullNameConfirmation(e.target.value)}
                />
                {fullNameConfirmation.trim() && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs mt-2 opacity-70"
                  >
                    ✓ Nome digitado: <strong>{fullNameConfirmation}</strong>
                  </motion.p>
                )}
              </motion.div>

              {/* Botão Confirmar */}
              <motion.button
                whileHover={allTermsAccepted && fullNameConfirmation.trim() ? { scale: 1.02 } : {}}
                whileTap={allTermsAccepted && fullNameConfirmation.trim() ? { scale: 0.98 } : {}}
                className={`btn w-full ${allTermsAccepted && fullNameConfirmation.trim() ? 'btn-primary' : 'btn-disabled'} btn-lg`}
                onClick={handleConfirmTerms}
                disabled={!allTermsAccepted || !fullNameConfirmation.trim()}
              >
                {!allTermsAccepted
                  ? 'Aceite todos os termos para continuar'
                  : !fullNameConfirmation.trim()
                    ? 'Digite seu nome completo para confirmar'
                    : '✓ Confirmar e Continuar'}
              </motion.button>

              <p className="text-center text-xs opacity-60 mt-3">
                Ao confirmar, você declara ter lido e aceito todos os termos acima e assume total responsabilidade por suas ações na plataforma.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {!currentUser ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Carregando...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Criar novo post */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100 mb-2 overflow-hidden shadow-sm border-b border-base-300"
          >
            <div className="p-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${currentUser.role.color} flex items-center justify-center font-bold text-sm flex-shrink-0 relative overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {roleIcons[currentUser.role.key] ? (
                    React.createElement(roleIcons[currentUser.role.key], { className: "w-5 h-5 text-white relative z-10" })
                  ) : (
                    <span className="relative z-10">{currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-bold">{currentUser.name}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${currentUser.role.color}`}>
                    {currentUser.role.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-3 items-end">
                <textarea
                  className="textarea textarea-bordered w-full resize-none bg-base-100"
                  placeholder={hasAcceptedTerms ? "No que você está pensando?" : "Aceite os termos para postar..."}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                  disabled={!hasAcceptedTerms}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-circle btn-lg"
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || !hasAcceptedTerms}
                >
                  <Send size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Lista de posts */}
          <AnimatePresence>
            <div className="space-y-2">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-base-100 p-4"
                >
                  {/* Header do post */}
                  <div className="flex gap-3">
                    {/* Timeline vertical */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className={`w-10 h-10 rounded-full ${post.user.role.color} flex items-center justify-center font-bold text-sm relative overflow-hidden`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        {roleIcons[post.user.role.key] ? (
                          React.createElement(roleIcons[post.user.role.key], { className: "w-5 h-5 text-white relative z-10" })
                        ) : (
                          <span className="relative z-10">{post.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                        )}
                      </motion.div>
                      {expandedComments[post.id] && post.comments && post.comments.length > 0 && (
                        <div className="w-0.5 flex-1 bg-base-300 mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{post.user.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${post.user.role.color}`}>
                            {post.user.role.label}
                          </span>
                          <span className="text-sm opacity-60">· {formatTime(post.timestamp)}</span>
                        </div>
                        {post.user.email === currentUser.email && (
                          <div className="dropdown dropdown-end">
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              tabIndex={0}
                              className="btn btn-ghost btn-sm btn-circle"
                            >
                              <MoreHorizontal size={18} />
                            </motion.button>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-20">
                              <li>
                                <button
                                  className="text-error"
                                  onClick={async () => {
                                    if (confirm('Tem certeza que deseja excluir este post?')) {
                                      try {
                                        await deleteDoc(doc(db, 'posts', post.id));
                                      } catch (error) {
                                        console.error('Erro ao deletar post:', error);
                                      }
                                    }
                                  }}
                                >
                                  Excluir post
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo do post */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                        className="mt-2"
                      >
                        {post.content}
                      </motion.p>

                      {/* Ações do post */}
                      <div className="flex gap-4 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`btn btn-ghost btn-sm gap-1 ${post.likes?.includes(currentUser.email) ? 'text-error' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <motion.div
                            animate={post.likes?.includes(currentUser.email) ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart size={18} fill={post.likes?.includes(currentUser.email) ? 'currentColor' : 'none'} />
                          </motion.div>
                          <span>{post.likes?.length || 0}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`btn btn-ghost btn-sm gap-1 ${expandedComments[post.id] ? 'text-primary' : ''}`}
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircle size={18} fill={expandedComments[post.id] ? 'currentColor' : 'none'} />
                          <span>{post.comments?.length || 0}</span>
                        </motion.button>
                      </div>

                      {/* Comentários com timeline */}
                      <AnimatePresence>
                        {expandedComments[post.id] && post.comments && post.comments.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 space-y-3"
                          >
                            {post.comments.map((comment, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-3"
                              >
                                {/* Timeline do comentário */}
                                <div className="flex flex-col items-center">
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: idx * 0.1 + 0.2 }}
                                    className={`w-8 h-8 rounded-full ${comment.user.role.color} flex items-center justify-center font-bold text-xs relative overflow-hidden`}
                                  >
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    />
                                    {roleIcons[comment.user.role.key] ? (
                                      React.createElement(roleIcons[comment.user.role.key], { className: "w-4 h-4 text-white relative z-10" })
                                    ) : (
                                      <span className="relative z-10">{comment.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                                    )}
                                  </motion.div>
                                  {idx < post.comments.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-base-300 mt-2"></div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-base-200 rounded-lg p-3"
                                  >
                                    <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">{comment.user.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${comment.user.role.color}`}>
                                          {comment.user.role.label}
                                        </span>
                                      </div>
                                      <span className="text-xs opacity-60">{formatTime(comment.timestamp)}</span>
                                    </div>
                                    <div className="text-sm">{comment.content}</div>
                                  </motion.div>
                                  <div className="flex gap-3 mt-1">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className={`text-xs opacity-60 hover:opacity-100 flex items-center gap-1 ${comment.likes?.includes(currentUser.email) ? 'text-error' : ''}`}
                                      onClick={() => handleLikeComment(post.id, idx)}
                                    >
                                      <Heart size={12} fill={comment.likes?.includes(currentUser.email) ? 'currentColor' : 'none'} />
                                      {comment.likes?.length > 0 && <span>{comment.likes.length}</span>}
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Input de comentário */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-2 mt-3"
                      >
                        <div className={`w-8 h-8 rounded-full ${currentUser.role.color} flex items-center justify-center font-bold text-xs`}>
                          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <input
                          type="text"
                          placeholder="Escreva um comentário..."
                          className="input input-bordered input-sm flex-1"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -10 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-primary btn-sm btn-circle"
                          onClick={() => handleComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                        >
                          <Send size={16} />
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}