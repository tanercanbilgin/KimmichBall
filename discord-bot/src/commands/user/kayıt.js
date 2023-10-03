// Definitions
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: {
        name: "kayıt",
        cooldown: 5,
        slash: new SlashCommandBuilder()
            .setName('kayıt')
            .setDescription('Kayıt olmak için kullanılır.')
            .addStringOption(option =>
                option.setName('auth')
                    .setDescription('Kayıt olmak için gereken kodu girin.')
                    .setRequired(true)),
    },
    async execute(interaction) {

        const discord_roles = {
            "default": "835149597688201246",
            "isVIP": "839830479363506176",
            "isMaster": "835149585403609108",
            "isAdmin": "839206422461546557"
        }
        if (interaction.channel.id !== '980178670914265089') {
            await interaction.reply({
                content: 'Kanalın amacı kayıt olmak, eğer yanlış kullanıma devam edersen uzaklaştırılıcaksın!',
                ephemeral: true
            });
            return;
        }

        const auth = interaction.options.getString('auth');
        try {
            let userData = null;
            if (auth.length === 137) {
                let regex = /(?:idkey)\.(.*?)(?:\.)/g;
                auth = regex.exec(auth)[1];
            }
            const response = await fetch(`http://localhost:3100/api/getAuth/${auth}`);
            if (response.ok) {
                userData = await response.json();
            }

            if (userData && userData.discordID === "0") {
                const roles = Object.entries(userData).filter(
                    ([key, value]) =>
                        key.startsWith("is") &&
                        value === true &&
                        !interaction.member.roles.cache.has(discord_roles[key])
                );
                const _roles = Object.entries(discord_roles).filter(([k, v]) =>
                    roles.map((r) => r[0]).includes(k)
                );
                await interaction.member.roles.add(_roles.map((r) => r[1]));
                await interaction.member.roles.add(discord_roles.default);
                await interaction.member.setNickname(userData.isim);
                await fetch(`http://localhost:3100/api/update/${auth}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ discordID: interaction.user.id })
                });
                await interaction.reply({
                    content: 'Sunucumuza başarıyla kayıt oldun! Odalarımızın devamı için VIP alarak bizlere destek olabilirsin.',
                    ephemeral: true
                });
            }
            else if (auth.length != 43 || auth.length != 137) {
                await interaction.reply({
                    content: 'Kodu yanlış veya eksik girdin, tekrar kontrol et.\nAyrıca, uygulama kullanıyosan kodun farklı; yöneticilerden yardım alabilirsin.',
                    ephemeral: true
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
};