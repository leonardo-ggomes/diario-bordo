require('dotenv').config();
const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const Feedback = require('./models/Feedback');
const User = require('./models/User');
const Config = require('./models/Config');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'chave-secreta-do-seu-projeto',
    resave: false,
    saveUninitialized: true
}));

User.hasMany(Feedback, { foreignKey: 'userId' });
Feedback.belongsTo(User, { foreignKey: 'userId' });

// Middlewares de Proteção
const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    next();
};

const checkAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.userRole !== 'admin') {
        return res.status(403).send("Acesso negado.");
    }
    next();
};

// --- ROTAS DE AUTENTICAÇÃO E USUÁRIOS ---

app.get('/login', (req, res) => {
    res.render('login', { error: req.query.error || null });
});

app.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        
        // SEGURANÇA: Restringe acesso apenas a usuários cadastrados previamente pelo Admin
        const user = await User.findOne({ where: { email: email.trim() } });

        if (!user) {
            return res.redirect('/login?error=Acesso negado. E-mail não autorizado pela administração.');
        }

        req.session.userId = user.id;
        req.session.userName = user.name;
        req.session.userRole = user.role;

        if (user.role === 'admin') return res.redirect('/admin');
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Erro no login.");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Gestão de Usuários (Apenas Admin)
app.get('/admin/users', checkAdmin, async (req, res) => {
    const users = await User.findAll({ order: [['name', 'ASC']] });
    res.render('admin-users', { users });
});

app.post('/admin/users', checkAdmin, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        await User.create({ name, email: email.trim(), role });
        res.redirect('/admin/users');
    } catch (error) {
        res.redirect('/admin/users');
    }
});

app.post('/admin/users/delete/:id', checkAdmin, async (req, res) => {
    await User.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/users');
});

// --- GESTÃO DE TAGS / MARCADORES (Apenas Admin) ---

const Tag = require('./models/Tag'); // Certifique-se de que o modelo foi importado no topo ou defina-o aqui

app.get('/admin/tags', checkAdmin, async (req, res) => {
    try {
        const tags = await Tag.findAll({ order: [['name', 'ASC']] });
        res.render('admin-tags', { tags });
    } catch (error) {
        res.status(500).send("Erro ao carregar as tags.");
    }
});

app.post('/admin/tags', checkAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (name && name.trim()) {
            await Tag.findOrCreate({ where: { name: name.trim() } });
        }
        res.redirect('/admin/tags');
    } catch (error) {
        res.redirect('/admin/tags');
    }
});

app.post('/admin/tags/delete/:id', checkAdmin, async (req, res) => {
    try {
        await Tag.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/tags');
    } catch (error) {
        res.redirect('/admin/tags');
    }
});
// --- JANELA DE FEEDBACK & ROTAS DO ALUNO ---

app.get('/', checkAuth, async (req, res) => {
    try {
        // Verifica se a janela de coleta está aberta
        const windowConfig = await Config.findOne({ where: { key: 'feedback_open' } });
        const isOpen = windowConfig ? windowConfig.value === 'true' : false;

        // Se estiver fechada, redireciona o aluno direto para o histórico
        if (!isOpen) {
            return res.redirect('/dashboard?info=closed');
        }

        const Tag = require('./models/Tag');
        const tags = await Tag.findAll();
        res.render('index', { userName: req.session.userName, tags });
    } catch (error) {
        res.status(500).send("Erro no servidor.");
    }
});

app.post('/submit-feedback', checkAuth, async (req, res) => {
    const windowConfig = await Config.findOne({ where: { key: 'feedback_open' } });
    if (!windowConfig || windowConfig.value !== 'true') {
        return res.status(403).send("A coleta está fechada.");
    }
    
    const { sentiment, tags, comments } = req.body;
    const tagsString = Array.isArray(tags) ? tags.join(', ') : (tags || '');
    
    await Feedback.create({
        sentiment_score: sentiment,
        tags: tagsString,
        comments: comments,
        userId: req.session.userId
    });
    res.render('success');
});

app.get('/dashboard', checkAuth, async (req, res) => {
    const historico = await Feedback.findAll({
        where: { userId: req.session.userId },
        order: [['createdAt', 'DESC']]
    });
    const getEmoji = (score) => {
        const emojis = { 1: '😫', 2: '😕', 3: '😐', 4: '🙂', 5: '🤩' };
        return emojis[score] || '😐';
    };
    res.render('dashboard', { 
        historico, 
        getEmoji, 
        userName: req.session.userName,
        info: req.query.info || null 
    });
});


// --- CONTROLE DE SESSÃO DO ADMIN ---

app.get('/admin', checkAdmin, async (req, res) => {
    const feedbacks = await Feedback.findAll({ include: [User], order: [['createdAt', 'DESC']] });
    const windowConfig = await Config.findOne({ where: { key: 'feedback_open' } });
    const isOpen = windowConfig ? windowConfig.value === 'true' : false;

    const totalRespostas = feedbacks.length;
    const somaSentimentos = feedbacks.reduce((acc, curr) => acc + curr.sentiment_score, 0);
    const mediaSentimento = totalRespostas > 0 ? (somaSentimentos / totalRespostas).toFixed(1) : 0;

    const getEmojiFromScore = (score) => {
        if (score >= 4.5) return '🤩';
        if (score >= 3.5) return '🙂';
        if (score >= 2.5) return '😐';
        return '😕';
    };

    res.render('admin', {
        feedbacks, totalRespostas, mediaSentimento, isOpen,
        climaGeral: getEmojiFromScore(mediaSentimento)
    });
});

app.post('/admin/toggle-feedback', checkAdmin, async (req, res) => {
    const windowConfig = await Config.findOne({ where: { key: 'feedback_open' } });
    const currentValue = windowConfig ? windowConfig.value : 'false';
    const newValue = currentValue === 'true' ? 'false' : 'true';
    
    await Config.upsert({ key: 'feedback_open', value: newValue });
    res.redirect('/admin');
});

// Sincronização e Inicialização
sequelize.sync({ alter: true }).then(async () => {
    // Garante que o estado inicial da janela exista no banco
    await Config.findOrCreate({ where: { key: 'feedback_open' }, defaults: { value: 'false' } });
    
    // Semente opcional de administrador de testes caso queira subir o banco limpo
    await User.findOrCreate({ 
        where: { email: 'admin@empresa.com' }, 
        defaults: { name: 'Admin Master', role: 'admin' } 
    });

    app.listen(process.env.PORT || 3000, () => console.log('Servidor operacional em http://localhost:3000'));
});