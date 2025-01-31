import { db } from '.';
import { servers, wipes, discordAlerts } from './schema';
import { eq } from 'drizzle-orm';

export async function trackServer(battlemetricsId, serverName, wipeSchedules) {
  const server = await db.insert(servers).values({
    battlemetricsId,
    serverName,
    lastChecked: Date.now(),
    createdAt: Date.now()
  }).returning().get();

  const wipesData = wipeSchedules.map(wipe => ({
    serverId: server.id,
    wipeDate: wipe.datetime,
    createdAt: Date.now()
  }));

  await db.insert(wipes).values(wipesData);
  
  return server;
}

export async function setupDiscordAlert(serverId, channelId, guildId) {
  return db.insert(discordAlerts).values({
    serverId,
    channelId,
    guildId,
    createdAt: Date.now()
  }).returning().get();
}

export async function getUpcomingWipes() {
  return db.query.wipes.findMany({
    where: eq(wipes.wipeDate, '>', new Date().toISOString()),
    with: {
      server: true
    }
  });
}
