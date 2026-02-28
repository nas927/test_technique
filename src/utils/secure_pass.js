const bcrypt = require("bcrypt");

const hashPassword = async (plainPassword) => {
    const saltRounds = 12;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        console.log('Mot de passe haché :', hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        if (match) {
            console.log('✅ Mot de passe valide');
        } else {
            console.log('❌ Mot de passe invalide');
        }
        return match;
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe :', error);
        throw error;
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};