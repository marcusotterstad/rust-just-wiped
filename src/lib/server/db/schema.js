import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const servers = sqliteTable('servers', {
  id: integer('id').primaryKey(),
  battlemetricsId: text('battlemetrics_id').notNull().unique(),
  serverName: text('server_name').notNull(),
  lastChecked: integer('last_checked'),
  createdAt: integer('created_at').notNull()
});

export const wipes = sqliteTable('wipes', {
  serverId: integer('server_id').references(() => servers.id),
  wipeDate: text('wipe_date').notNull(),
  remindersSent: text('reminders_sent').default('[]'),
  createdAt: integer('created_at').notNull()
});

export const discordAlerts = sqliteTable('discord_alerts', {
  id: integer('id').primaryKey(),
  serverId: integer('server_id').references(() => servers.id),
  channelId: text('channel_id').notNull(),
  guildId: text('guild_id').notNull(),

  createdAt: integer('created_at').notNull()
});