// Definitions
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "sıralama",
        cooldown: 5,
        slash: new SlashCommandBuilder()
            .setName('sıralama')
            .setDescription('Sıralama komutları')
            .addStringOption(option =>
                option.setName('kategori')
                    .setDescription('İstatistik türü')
                    .setRequired(false)
                    .addChoices({ name: 'Puan', value: 'puan' },
                        { name: 'Gol', value: 'gol' },
                        { name: 'Asist', value: 'asist' },
                        { name: 'Kendi Kalesine', value: 'kk' },
                        { name: 'Oyunlar', value: 'oyunlar' },
                        { name: 'Galibiyet', value: 'galibiyet' },
                        { name: 'Aktiflik', value: 'aktiflik' },
                        { name: 'Gol Yememe', value: 'cs' }),
            )
    },
    async execute(interaction) {
        const statsList = ["puan", "gol", "asist", "kk", "oyunlar", "galibiyet", "aktiflik", "cs"];

        function getHoursStats(time) {
            return Math.floor(time / 3600);
        }

        function getMinutesStats(time) {
            return Math.floor(time / 60) - getHoursStats(time) * 60;
        }

        function getTimeStats(time) {
            if (getHoursStats(time) > 0) {
                return `${getHoursStats(time)} saat ${getMinutesStats(time)} dakika`;
            } else {
                return `${getMinutesStats(time)} dakika`;
            }
        }

        try {

            const statsOption = interaction.options.get('kategori');
            const stats = statsOption ? statsOption.value : 'puan';
            if (!statsList.includes(stats)) {
                const embed = new EmbedBuilder()
                    .setColor('#ED4245')
                    .setDescription(`Böyle bir istatistik yok.\nPuan, Gol, Asist, KK, CS, Oyunlar, Galibiyet, Aktiflik yazarak tekrar dene`);
                return await interaction.reply({ embeds: [embed] });
            }

            const response = await fetch('http://localhost:3100/api/getAll');
            const data = await response.json();

            data.sort((a, b) => b[stats] - a[stats]).splice(10);

            if (!data.length) {
                const embed = new EmbedBuilder()
                    .setColor('#ED4245')
                    .setDescription(`Bir sorun var, lütfen yöneticilerle iletişime geç.`);
                return await interaction.reply({ embeds: [embed] });
            }

            function avatar(puan) {
                if (puan < 1000) return "👎";
                if (puan >= 1000 && puan < 1200) return "🔥";
                if (puan >= 1200 && puan < 1400) return "⚡";
                if (puan >= 1400 && puan < 1600) return "💎";
                if (puan >= 1600 && puan < 1800) return "🏆";
                if (puan >= 1800 && puan < 2000) return "👑";
                if (puan >= 2000) return "💯";
            }

            const embed = new EmbedBuilder()
                .setColor('#c0f00b')
                .setAuthor({ name: `👑 ${stats.toLocaleUpperCase('tr-TR')} KRALLIĞI` })
                .addFields(
                    { name: '```SIRALAMA```', value: `\`\`\`c\n${data.map((d, i) => `${i + 1}`).join('\n')}\`\`\``, inline: true },
                    { name: '```İSİM```', value: `\`\`\`${data.map((d) => `${avatar(d.puan)} ${d.isim}`).join('\n')}\`\`\``, inline: true },
                    {
                        name: `\`\`\`${stats.toLocaleUpperCase('tr-TR')}\`\`\``, value: `\`\`\`c\n${data.map((d) => {
                            if (stats === 'aktiflik') {
                                return getTimeStats(d[stats]);
                            }
                            return d[stats];
                        }).join('\n')}\`\`\``, inline: true
                    }
                )
                .setFooter({ text: `🏆 Sıralama komutları: Puan, Gol, Asist, KK, CS, Oyunlar, Galibiyet, Aktiflik` });

            return await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
        }
    }
};