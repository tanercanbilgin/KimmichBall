const { EmbedBuilder } = require("discord.js");

const error = (interaction, error = "Bilinmeyen bir hata oluştu!") => {
    const errorEmbed = new EmbedBuilder()
        .setColor("#ED4245")
        .setDescription(`${error}`)
    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}
global.error = error;
;