require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

const userSchema = new mongoose.Schema({
    name: String,
    deathDate: Date,
    cause: String,
    acceptedTerms: { type: Boolean, default: true },
    startTime: { type: Date, default: Date.now },
    surviveAttempted: { type: Boolean, default: false },
    surviveResult: { type: Boolean, default: false }
});

const User = mongoose.model('Countuser', userSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function generateRandomDeathData() {
    const minHours = 1;
    const maxHours = 60 * 24;
    const randomHours = Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
    
    const deathDate = new Date();
    deathDate.setHours(deathDate.getHours() + randomHours);
    
    const causes = [
        "Caída de un asteroide",
        "Ataque de pato asesino",
        "Exceso de memes",
        "Deshidratación por café",
        "Atrapado en un bucle de Netflix",
        "Risa mortal por TikTok",
        "Aburrimiento extremo",
        "Zombie vegano",
        "Alienígena aburrido",
        "Error 404 en la vida real",
        "Lag masivo en la vida real",
        "Intento fallido de razonar con una IA",
        "Sobredosis de tacos al pastor",
        "Ataque de nostalgia de los 80",
        "Perdido para siempre en un IKEA",
        "Explosión espontánea de purpurina",
        "Abducido por vacas con doctorado",
        "Demasiado tiempo esperando el Metro",
        "Muerte por aburrimiento en PowerPoint",
        "Selfie extremo con un tiburón vegetariano",
        "Combustión interna por salsa habanera",
        "Tragado por las profundidades del sofá",
        "Ataque de pelusa asesina gigante",
        "Discusión perdida contra un gato",
        "Infarto por un estornudo propio",
        "Enredo mortal con cables de audífonos",
        "Caída infinita en Wikipedia",
        "Ataque de risa incontrolable",
        "Sobredosis de aire fresco inesperado",
        "Karma instantáneo por no compartir un meme"
    ];

    return {
        date: deathDate,
        cause: causes[Math.floor(Math.random() * causes.length)]
    };
}

function normalizeName(name) {
    if (!name) return "";
    return name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/calculate', async (req, res) => {
    try {
        let { name } = req.body;
        const cleanName = normalizeName(name);
        
        if (!cleanName) return res.redirect('/');

        const existingUser = await User.findOne({ name: cleanName });
        if (existingUser) return res.redirect(`/countdown/${existingUser._id}`);
        
        const deathData = generateRandomDeathData();
        const newUser = new User({
            name: cleanName,
            deathDate: deathData.date,
            cause: deathData.cause
        });

        const savedUser = await newUser.save();
        res.redirect(`/countdown/${savedUser._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get('/countdown/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.redirect('/');
        res.render('countdown', { user });
    } catch (err) {
        res.redirect('/');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App Countdown en PORT: ${PORT}`);
});