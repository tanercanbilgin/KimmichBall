// Definitions
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "rank",
        cooldown: 5,
        slash: new SlashCommandBuilder()
            .setName('rank')
            .setDescription('Sunucudaki rankınızı gösterir.')
            .addIntegerOption(option =>
                option.setName('sira')
                    .setDescription('Sıralamasını girdiğiniz kişinin rankını verir.')
                    .setRequired(false)),
    },
    async execute(interaction) {
        const sira = interaction.options.getInteger('sira');

        try {
            const response = await fetch(`http://localhost:3100/api/getAll`);
            const pos = await response.json();
            pos.sort((a, b) => b.puan - a.puan);
            for (let i = 0; i < pos.length; i++) {
                pos[i].rank = i + 1;
            }
            let user;

            if (sira) user = pos.find(element => element.rank == sira);
            else user = pos.find(element => element.discordID == interaction.user.id)

            if (user) {
                function getDate(tarih) {
                    var options = {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    };
                    var date = new Date(tarih * 1000);
                    var date_string = date.toLocaleString('tr-TR', options);
                    return date_string
                }

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

                function avatar() {
                    if (user.puan < 1000) return "👎";
                    if (user.puan >= 1000 && user.puan < 1200) return "🔥";
                    if (user.puan >= 1200 && user.puan < 1400) return "⚡";
                    if (user.puan >= 1400 && user.puan < 1600) return "💎";
                    if (user.puan >= 1600 && user.puan < 1800) return "🏆";
                    if (user.puan >= 1800 && user.puan < 2000) return "👑";
                    if (user.puan >= 2000) return "💯";
                }

                const winrate = ((100 * user.galibiyet) / (user.oyunlar || 1)).toFixed(0);

                const _Embed = new EmbedBuilder()

                    .setTitle(`\`\`\`${avatar()}・${user.isim} #${user.rank}\`\`\``)
                    .setColor("#c0f00b")
                    .setAuthor({ "name": "📈 RANK BİLGİLENDİRME" })
                    .addFields({
                        "name": "```⚽ Gol```",
                        "value": `\`\`\`c\n${user.gol}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```🦶 Asist```",
                        "value": `\`\`\`c\n${user.asist}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```❌ Kendi Kalene```",
                        "value": `\`\`\`c\n${user.kk}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```⬆️ Galibiyet```",
                        "value": `\`\`\`c\n${user.galibiyet}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```🅿️ Toplam Oyunlar```",
                        "value": `\`\`\`c\n${user.oyunlar}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```💯 Kazanma Oranı```",
                        "value": `\`\`\`c\n%${winrate}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```🥅 CS```",
                        "value": `\`\`\`c\n${user.cs}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```👉 Puan```",
                        "value": `\`\`\`c\n${user.puan}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```💰 Bakiye```",
                        "value": `\`\`\`c\n${user.bakiye}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```🗓️ Kayıt```",
                        "value": `\`\`\`c\n${getDate(user.createdAt)}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```⌛ Aktiflik```",
                        "value": `\`\`\`c\n${getTimeStats(user.aktiflik)}\`\`\``,
                        "inline": true,
                    }, {
                        "name": "```📅 Son Giriş```",
                        "value": `\`\`\`c\n${getDate(user.updatedAt)}\`\`\``,
                        "inline": true,
                    })
                    .setFooter({
                        "text": `💖 VIP alarak bu sunucunun devamını sağlayabilirsin `,
                    });
                await interaction.reply({
                    embeds: [_Embed],
                    ephemeral: false
                });
            } else {
                const _Embed = new EmbedBuilder()
                    .setColor("#ED4245")
                    .setDescription("Odada böyle bir hesap bulunamadı, lütfen yöneticilerle iletişime geç.");
                await interaction.reply({
                    embeds: [_Embed],
                    ephemeral: false
                });
            }
        } catch (e) {
            console.error(e);
            await interaction.reply({
                content: 'Bir hata ile karşılaştık, lütfen daha sonra tekrar deneyin.',
                ephemeral: true
            });
        }
    }
}