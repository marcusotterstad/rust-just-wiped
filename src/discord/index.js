import { Client, Events, GatewayIntentBits } from 'discord.js';
import { env } from '$env/dynamic/private';

export function startBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildScheduledEvents
    ]
  });

  client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!track')) {
      const url = message.content.split(' ')[1];
      
      if (!url) {
        return message.reply('Please provide a BattleMetrics URL. Usage: !track <url>');
      }

      const battlemetricsId = url.split('/').pop();
      
      try {
        const response = await fetch(`http://localhost:5173/api/scrape?id=${battlemetricsId}`);
        const data = await response.json();
        
        // Create Discord event for the wipe
        const wipeDate = new Date(data.wipes[0].datetime);
        const wipeEndDate = new Date(wipeDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours after start

        await message.guild.scheduledEvents.create({
          name: `${data.serverName} Wipe`,
          scheduledStartTime: wipeDate,
          scheduledEndTime: wipeEndDate,
          privacyLevel: 2,
          entityType: 2, // VOICE type
          description: `Server wipe for ${data.serverName}`,
          channel: message.channel.id // Use the current channel
        });

        message.reply(`Created wipe event for ${data.serverName} on ${wipeDate.toLocaleString()}`);
      } catch (error) {
        message.reply('Failed to create event. Please check permissions and try again.');
      }
    }
  });

  client.login(env.DISCORD_TOKEN);
}
